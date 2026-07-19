// EmailJS credentials (emailjs.com) — Service ID / Template ID / Public Key
export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

// Template variables used: {{client_name}}, {{client_email}}, {{client_phone}},
//   {{services}}, {{workers}}, {{preferred_person}}, {{datetime}}, {{message}}

export function formatPrague(date, time) {
  try {
    return new Intl.DateTimeFormat('cs-CZ', {
      timeZone: 'Europe/Prague',
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(`${date}T${time}`))
  } catch {
    return `${date} ${time}`
  }
}

export function buildEmailParams({ items, date, time, name, email, phone, message, preferredPerson }) {
  const servicesLines = items
    .map((item) => `- ${item.name} (${item.price}) — ${item.workers.join(', ')}`)
    .join('\n')

  const workers = [...new Set(items.flatMap((item) => item.workers))].join(', ')

  return {
    client_name: name,
    client_email: email || '—',
    client_phone: phone || '—',
    services: servicesLines || '—',
    workers: workers || '—',
    preferred_person: preferredPerson || '—',
    datetime: formatPrague(date, time),
    message: message || '—',
  }
}
