import querystring from 'querystring'
import history from 'lib/history'

export const searchToObject = (search) => {
  return querystring.parse((search || '').replace(/^\?/, ''))
}

export const getLocation = () => {
  const pathname = window.location.pathname
  const query = searchToObject(window.location.search)
  return new Location({pathname, query})
}

const objectToSearch = (object) => {
  if (!object) return
  for(const key in object){
    const value = object[key]
    if (value === null || value === undefined)
      delete object[key]
  }
  if (Object.keys(object).length === 0) return
  return querystring.stringify(object)
}

const locationToHref = location => {
  if (typeof location === 'string') return location
  let href = location.pathname
  let query = objectToSearch(location.query)
  if (query) href += '?' + query
  return href
}

export const setLocation = function(location){
  history.pushState(null, window.document.title, locationToHref(location))
}

export const setPathname = function(pathname){
  const { query } = getLocation()
  setLocation({ pathname, query })
}


class Location {
  constructor({pathname, query}){
    this.pathname = pathname
    this.query = query
  }

  toString(){
    return locationToHref(this)
  }

  replaceQuery(query){
    return new this.constructor({
      pathname: this.pathname,
      query,
    })
  }

  withQuery(newQuery){
    return this.replaceQuery({...this.query, ...newQuery})
  }
}
