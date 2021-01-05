module.exports = {
  pushState(stateObject, title, href){
    if (this.hrefIsCurrentHref(href)) return
    window.history.pushState(stateObject, title, href)
    scrollToTop()
  },
  hrefIsCurrentHref(href){
    return this.expandHref(href) === window.location.href
  },
  expandHref(href){
    const a = window.document.createElement('a')
    a.href = href
    return a.href
  },
}

const scrollToTop = () => {
  setTimeout(() => { window.scrollTo(0, 0) }, 100)
}
