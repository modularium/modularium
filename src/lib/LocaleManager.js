const { Collection } = require('discord.js')
const { EventEmitter } = require('events')

const get = (object, path, value) => {
  const pathArray = Array.isArray(path) ? path : path.split('.').filter(key => key)
  const pathArrayFlat = pathArray.flatMap(part => typeof part === 'string' ? part.split('.') : part)

  return pathArrayFlat.reduce((obj, key) => obj && obj[key], object) || value
}

class LocaleManager extends EventEmitter {
  constructor () {
    super()
    this._locales = new Collection()
    this._locales.toJSON = () => {
      const json = {}

      const rest = [...this._locales.entries()]

      rest.forEach(([key, val]) => {
        json[key] = val
      })

      return json
    }
  }

  add (key, val) {
    this._locales.set(key, val)
  }

  remove (key) {
    const locale = this.find(key)
    this._locales.delete(locale)
  }

  find (key) {
    const locale = this._locales.find((_v, k) => {
      return k === key
    })

    return locale
  }

  localeString (path, ...info) {
    const st = get(this._locales.toJSON(), path, path)
    if (info) {
      const splitted = st.split(/(%s|%[0-9]\$s)/)
      let sindex = 0
      splitted.forEach((str, i) => {
        if (/(%s)/.test(str)) {
          splitted[i] = info[sindex]
          sindex++
        } else if (/(%[0-9]\$s)/.test(str)) {
          const iex = /(?!(\$s|%))([0-9]+)/.exec(str)[0] - 1
          splitted[i] = info[iex]
        }
      })
      return splitted.join('')
    } else return st
  }
  /*
    static flat(input) {
        function flat(res, key, val, pre = '') {
          const prefix = [pre, key].filter(v => v).join('.');
          return typeof val === 'object'
            ? Object.keys(val).reduce((prev, curr) => flat(prev, curr, val[curr], prefix), res)
            : Object.assign(res, { [prefix]: val});
        }

        return Object.keys(input).reduce((prev, curr) => flat(prev, curr, input[curr]), {});
    } */
}

module.exports = {
  LocaleManager
}
