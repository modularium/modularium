const fs = require('fs')
const fsextra = require('fs-extra')
const path = require('path')
const { LocaleManager } = require('../lib/LocaleManager')

/**
 * Localization module
 */
module.exports = async (plugin, config) => {
  fsextra.mkdirp(path.join(process.cwd(), 'locale'))
  plugin.locale = new LocaleManager()
  plugin.localeString = (key, ...rest) => plugin.locale.localeString(key, ...rest)

  const load = async p => {
    return fs.readFile(p, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        plugin.err(err.message)
        return
      }
      const jsdata = JSON.parse(data)
  
      Object.entries(jsdata).forEach(([key, val]) => {
        plugin.locale.add(key, val)
      })
    })
  }

  await load(path.join(__dirname, '../locale/' + config.lang + '.json'))
  await load(path.join(process.cwd(), 'locale/' + config.lang + '.json'))
}
