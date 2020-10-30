export function getVerticalScrollParent(element){
  if (element === window || element === document) return element
  const computedStyle = window.getComputedStyle(element, null)
  const overflow = computedStyle.getPropertyValue('overflow')
  if (overflow === 'auto' || overflow === 'scroll') return element
  const overflowY = computedStyle.getPropertyValue('overflow-y')
  if (overflowY === 'auto' || overflowY === 'scroll') return element
  return getVerticalScrollParent(element.parentNode)
}
