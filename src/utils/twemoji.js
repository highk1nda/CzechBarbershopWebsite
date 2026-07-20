import twemoji from '@twemoji/api'

export function initTwemoji(root = document.body) {
  const parse = () => twemoji.parse(root, { folder: 'svg', ext: '.svg' })

  parse()

  let scheduled = false
  const observer = new MutationObserver(() => {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(() => {
      scheduled = false
      parse()
    })
  })

  observer.observe(root, { childList: true, subtree: true, characterData: true })

  return () => observer.disconnect()
}
