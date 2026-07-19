#!/usr/bin/env node
// One-time migration: reads the archived pre-Supabase data files (scripts/fixtures/*.js,
// src/i18n/locales/*/common.json) and seeds the Supabase tables defined in
// supabase/schema.sql. Run locally only — never imported by the app, never
// shipped, never run in CI.
//
// Usage:
//   SUPABASE_URL=https://xxxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   node scripts/migrate-to-supabase.mjs [--force]
//
// SUPABASE_SERVICE_ROLE_KEY is found in Supabase Studio -> Project Settings
// -> API -> service_role secret. It bypasses Row Level Security — never put
// it in a VITE_-prefixed env var or commit it anywhere.
//
// --force wipes and re-seeds all content tables (useful while iterating on
// this script locally). Without it, the script refuses to run if `services`
// already has rows, to avoid accidentally double-seeding a live project.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { SERVICES } from './fixtures/services.js'
import { team } from './fixtures/team.js'
import { RECOMMENDED_ADD_ONS } from './fixtures/addOns.js'
import { parsePrice, parseDuration } from '../src/utils/priceDuration.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FORCE = process.argv.includes('--force')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars. See the header of this script.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function readJson(relPath) {
  return JSON.parse(readFileSync(path.join(__dirname, '..', relPath), 'utf-8'))
}

const LANGS = ['cs', 'en', 'uk']
const LOCALE_COMMON = Object.fromEntries(LANGS.map(l => [l, readJson(`src/i18n/locales/${l}/common.json`)]))
const LOCALE_BOOKING = Object.fromEntries(LANGS.map(l => [l, readJson(`src/i18n/locales/${l}/booking.json`)]))

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object') {
      flatten(v, key, out)
    } else {
      out[key] = String(v)
    }
  }
  return out
}

function fail(message) {
  console.error(`\n✗ ${message}`)
  process.exit(1)
}

async function insert(table, rows) {
  if (rows.length === 0) return
  const { error } = await supabase.from(table).insert(rows)
  if (error) fail(`Inserting into "${table}" failed: ${error.message}`)
}

async function main() {
  console.log(`Migrating into ${SUPABASE_URL} ${FORCE ? '(--force: wiping existing content first)' : ''}`)

  const { data: existing, error: existingErr } = await supabase.from('services').select('id').limit(1)
  if (existingErr) fail(`Could not read "services" table — has supabase/schema.sql been applied? (${existingErr.message})`)
  if (existing.length > 0 && !FORCE) {
    fail('The "services" table already has rows. Re-run with --force to wipe and re-seed, or this looks like a live project you did not mean to touch.')
  }

  if (FORCE) {
    console.log('Wiping existing content tables...')
    const wipeOrder = [
      'recommended_addons', 'service_workers', 'service_photos', 'service_translations', 'services',
      'category_translations', 'categories', 'tab_translations', 'tabs',
      'team_member_translations', 'team_members',
      'site_content', 'site_settings',
    ]
    for (const table of wipeOrder) {
      const { error } = await supabase.from(table).delete()
      if (error) fail(`Could not wipe "${table}": ${error.message}`)
    }
  }

  // --- team_members -----------------------------------------------------
  console.log('Seeding team_members...')
  const nameToTeamId = {}
  for (let i = 0; i < team.length; i++) {
    const member = team[i]
    const { data, error } = await supabase
      .from('team_members')
      .insert({ photo_url: member.photo, sort_order: i })
      .select('id')
      .single()
    if (error) fail(`Inserting team member "${member.name}" failed: ${error.message}`)
    nameToTeamId[member.name] = data.id
    await insert('team_member_translations', [{ team_member_id: data.id, lang: 'cs', name: member.name, role: member.role }])
  }

  // --- tabs / categories --------------------------------------------------
  console.log('Seeding tabs and categories...')
  const categoryTitleToId = {}
  const seenTitles = new Set()

  for (let tabIndex = 0; tabIndex < SERVICES.length; tabIndex++) {
    const tab = SERVICES[tabIndex]
    const { data: tabRow, error: tabErr } = await supabase
      .from('tabs')
      .insert({ icon: tab.icon, sort_order: tabIndex })
      .select('id')
      .single()
    if (tabErr) fail(`Inserting tab "${tab.label}" failed: ${tabErr.message}`)
    await insert('tab_translations', [{
      tab_id: tabRow.id, lang: 'cs', label: tab.label, heading: tab.heading, description: tab.description, note: tab.note ?? null,
    }])

    for (let catIndex = 0; catIndex < tab.categories.length; catIndex++) {
      const category = tab.categories[catIndex]
      if (seenTitles.has(category.title)) {
        fail(`Category title "${category.title}" is used in more than one tab — the migration script assumes titles are globally unique (recommended_addons is keyed by title). Fix the collision or extend the script to disambiguate.`)
      }
      seenTitles.add(category.title)

      const { data: catRow, error: catErr } = await supabase
        .from('categories')
        .insert({ tab_id: tabRow.id, sort_order: catIndex })
        .select('id')
        .single()
      if (catErr) fail(`Inserting category "${category.title}" failed: ${catErr.message}`)
      categoryTitleToId[category.title] = catRow.id
      await insert('category_translations', [{ category_id: catRow.id, lang: 'cs', title: category.title }])
    }
  }

  // --- services -------------------------------------------------------
  console.log('Seeding services...')
  let serviceIndex = 0
  for (const tab of SERVICES) {
    for (const category of tab.categories) {
      for (const item of category.items) {
        const price = parsePrice(item.price)
        const duration = item.duration ? parseDuration(item.duration) : null
        if (!price) fail(`Could not parse price "${item.price}" for service "${item.id}"`)
        if (item.duration && !duration) fail(`Could not parse duration "${item.duration}" for service "${item.id}"`)

        const { error: svcErr } = await supabase.from('services').insert({
          id: item.id,
          icon: item.icon,
          category_id: categoryTitleToId[category.title],
          price_min: price.unknown ? null : price.min,
          price_max: price.unknown ? null : price.max,
          price_open_ended: price.unknown ? false : !!price.openEnded,
          price_unknown: !!price.unknown,
          duration_min_minutes: duration ? duration.min : null,
          duration_max_minutes: duration ? duration.max : null,
          duration_up_to: duration ? !!duration.upTo : false,
          sort_order: serviceIndex++,
        })
        if (svcErr) fail(`Inserting service "${item.id}" failed: ${svcErr.message}`)

        await insert('service_translations', [{
          service_id: item.id,
          lang: 'cs',
          name: item.name,
          description: item.desc ?? null,
          details_text: item.details?.text ?? null,
          details_steps: item.details?.steps ?? null,
        }])

        const photos = item.details?.photos ?? []
        await insert('service_photos', photos.map((url, i) => ({ service_id: item.id, url, sort_order: i })))

        const workerRows = (item.workers ?? []).map((name) => {
          const teamId = nameToTeamId[name]
          if (!teamId) fail(`Service "${item.id}" references unknown team member "${name}"`)
          return { service_id: item.id, team_member_id: teamId }
        })
        await insert('service_workers', workerRows)
      }
    }
  }

  // --- recommended_addons -----------------------------------------------
  console.log('Seeding recommended_addons...')
  for (const [categoryTitle, serviceIds] of Object.entries(RECOMMENDED_ADD_ONS)) {
    const categoryId = categoryTitleToId[categoryTitle]
    if (!categoryId) fail(`RECOMMENDED_ADD_ONS references unknown category title "${categoryTitle}"`)
    await insert('recommended_addons', serviceIds.map((serviceId, i) => ({ category_id: categoryId, service_id: serviceId, sort_order: i })))
  }

  // --- site_content (translated marketing copy) --------------------------
  console.log('Seeding site_content...')
  for (const lang of LANGS) {
    const flat = flatten({ ...LOCALE_COMMON[lang], ...LOCALE_BOOKING[lang] })
    await insert('site_content', Object.entries(flat).map(([key, value]) => ({ key, lang, value })))
  }

  // --- site_settings (untranslated config, hand-transcribed from Contact.jsx) ---
  console.log('Seeding site_settings...')
  await insert('site_settings', [
    { key: 'phone', value: '+420 000 000 000' },
    { key: 'email', value: 'info@maisonbeauty.cz' },
    { key: 'address_street', value: 'Na Bělidle 840/22' },
    { key: 'address_city', value: 'Praha 5, 150 00' },
    { key: 'hours_weekdays_time', value: '9:00 – 19:00' },
    { key: 'hours_saturday_time', value: '9:00 – 16:00' },
    { key: 'hours_sunday_closed', value: 'true' },
    { key: 'map_query', value: 'Na Bělidle 840/22, 150 00 Praha 5, Czech Republic' },
  ])

  console.log('\n✓ Migration complete.')
  console.log(`  team_members: ${team.length}`)
  console.log(`  tabs: ${SERVICES.length}`)
  console.log(`  categories: ${Object.keys(categoryTitleToId).length}`)
  console.log(`  services: ${serviceIndex}`)
  console.log('\nNote: phone/hours in site_settings are placeholders from the current site — ask the client to confirm/replace real values via the admin panel.')
}

main()
