const { FoxError } = require('@modularium/fox')
const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = (plugin, cfg) => {
  plugin.bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return

    const command = await plugin.slashCommands.find(interaction.commandName)

    if (!command) {
      interaction.reply(plugin.localeString('slashCommands.notDeployed', interaction.commandName))
      return
    }

    if (!command.execute) {
      interaction.reply(plugin.localeString('slashCommands.noExecution', command.name))
      return
    }

    command.execute(interaction)
  })

  // PRIMARY, a blurple button;
  // SECONDARY, a grey button;
  // SUCCESS, a green button;
  // DANGER, a red button;
  // LINK, a button that navigates to a URL.

  class InteractionHelper {
    constructor () {
      this._settings = {
        customPrefix: ''
      }
      this._buttonStyles = ['primary', 'secondary', 'success', 'danger', 'link']
    }

    setPrefix (prefix = undefined) {
      this._settings.customPrefix = prefix
    }

    createButton ({
      label,
      style = 'primary',
      id,
      url
    }) {
      if (!style || !label) { throw new FoxError('No style or label') }

      if (id && url) { throw new FoxError('You cannot use both id and url') }

      if (!this._buttonStyles.includes(style) || !this._buttonStyles.includes(style.toLowerCase())) { throw new FoxError('Style \'' + style + '\' not found. Use these styles: [ ' + this._buttonStyles.map(e => "'" + e + "'").join(', ') + ' ].') }

      if (Number.isInteger(style)) {
        if (!this._buttonStyles[style]) { throw new FoxError('Number \'' + style + '\' not usable for style.') }

        style = this._buttonStyles[style].toUpperCase()
      } else {
        style = style.toUpperCase()
      }

      const button = new MessageButton()
        .setLabel(label)
        .setStyle(style)

      if (style === 'LINK') {
        if (!url) { throw new FoxError('No URL for LINK button.') }

        button.setURL(url)
      } else {
        button.setCustomId((this._settings.customPrefix && (this._settings.customPrefix + '__')) + id)
      }

      return new MessageActionRow()
        .addComponents(
          button
        )
    }
  }

  plugin.interactionHelper = new InteractionHelper()
}
