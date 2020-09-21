let subscribers = []

const publish = function() {
  subscribers.forEach(handler => {
    handler(window.location)
  })
}

window.addEventListener('popstate', publish)

module.exports = {
  pushState(stateObject, title, href){
    if (this.hrefIsCurrentHref(href)) return
    window.history.pushState(stateObject, title, href)
    publish()
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
