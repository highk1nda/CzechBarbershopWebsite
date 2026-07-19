import { useState, useMemo, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useContent } from '../../../context/ContentContext'
import CategoryCard from '../CategoryCard'
import AccordionSection from '../AccordionSection'
import ServiceCard from '../ServiceCard'
import ServiceDetailModal from '../ServiceDetailModal'
import StepTransition from '../StepTransition'
import SearchBar from '../SearchBar'
import FilterChips from '../FilterChips'

export default function StepServices() {
  const { SERVICES, ALL_ITEMS, loading, error } = useContent()
  const [activeTabId, setActiveTabId] = useState(null)
  const [openCategory, setOpenCategory] = useState(null)
  const [modalItem, setModalItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (SERVICES.length > 0 && activeTabId === null) {
      setActiveTabId(SERVICES[0].id)
      setOpenCategory(SERVICES[0].categories[0]?.title ?? null)
    }
  }, [SERVICES, activeTabId])

  const activeTab = SERVICES.find((t) => t.id === activeTabId)
  const isSearching = searchQuery.trim().length > 0

  const searchResults = useMemo(() => {
    if (!isSearching) return []
    const q = searchQuery.trim().toLowerCase()
    return ALL_ITEMS.filter(
      (item) => item.name.toLowerCase().includes(q) || (item.desc && item.desc.toLowerCase().includes(q))
    )
  }, [searchQuery, isSearching, ALL_ITEMS])

  function handleCategoryCardClick(tab) {
    if (tab.id === activeTabId) return
    setActiveTabId(tab.id)
    setOpenCategory(tab.categories[0]?.title ?? null)
  }

  function handleChipClick(categoryTitle) {
    const tab = SERVICES.find((t) => t.categories.some((c) => c.title === categoryTitle))
    if (!tab) return
    setActiveTabId(tab.id)
    setOpenCategory(categoryTitle)
    requestAnimationFrame(() => {
      document.getElementById('services-category-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  if (error) {
    return (
      <p className="font-body text-sm text-warm text-center py-12">
        Nepodařilo se načíst ceník. Zkuste prosím obnovit stránku.
      </p>
    )
  }

  if (loading || !activeTab) {
    return <p className="font-body text-sm text-warm text-center py-12">Načítáme ceník…</p>
  }

  return (
    <div>
      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {!isSearching && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {SERVICES.map((tab) => (
              <CategoryCard
                key={tab.id}
                tab={tab}
                isActive={tab.id === activeTabId}
                onClick={() => handleCategoryCardClick(tab)}
              />
            ))}
          </div>

          <div className="mb-8">
            <FilterChips services={SERVICES} activeCategory={openCategory} onSelect={handleChipClick} />
          </div>
        </>
      )}

      {isSearching ? (
        <div id="services-category-panel">
          {searchResults.length === 0 ? (
            <p className="font-body text-sm text-warm text-center py-12">
              Pro „{searchQuery}“ jsme nic nenašli. Zkuste jiné hledání.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {searchResults.map((item) => (
                <div key={item.id}>
                  <p className="font-body text-[10px] tracking-widest uppercase text-mauve/70 mb-1.5">
                    {item.tabLabel} · {item.categoryTitle}
                  </p>
                  <ServiceCard item={item} onLearnMore={setModalItem} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <StepTransition id={activeTabId}>
          <div id="services-category-panel" className="rounded-3xl border border-stone bg-white shadow-soft px-5 sm:px-8">
            {activeTab.categories.map((category) => (
              <AccordionSection
                key={category.title}
                title={category.title}
                isOpen={openCategory === category.title}
                onToggle={() => setOpenCategory((o) => (o === category.title ? null : category.title))}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.items.map((item) => (
                    <ServiceCard key={item.id} item={item} onLearnMore={setModalItem} />
                  ))}
                </div>
              </AccordionSection>
            ))}
          </div>
        </StepTransition>
      )}

      {!isSearching && activeTab.note && (
        <p className="font-body text-sm text-frost italic mt-4">{activeTab.note}</p>
      )}

      <AnimatePresence>
        {modalItem && <ServiceDetailModal item={modalItem} onClose={() => setModalItem(null)} />}
      </AnimatePresence>
    </div>
  )
}
