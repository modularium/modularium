const { Collection } = require('discord.js')

/**
 * Main module of modularium commands
 * It's welcome to edit '404' and 'off' listeners but not others
 */
module.exports = async (plugin, config) => {
  plugin._commandListeners = new Collection()

  plugin._commandListeners.set('message', async msg => {
    if (!msg.content.startsWith(config.bot.prefix) || msg.author.bot || msg.author.id === plugin.bot.user.id) return

    const command = msg.content.slice(config.bot.prefix.length)

    plugin.commands.parseuse(command, msg)
      .then(args => plugin._commandListeners.get('use')(msg, command, args))
      .catch(({ name, message, code, stack }) => {
        if (name === 'FoxError') {
          if (code === '404' || code === 'off') {
            plugin._commandListeners.get(code)(msg, command)
          }
        } else {
          plugin.foxLog(`[${'ERR'.x196}] ` + name + ': ' + message)
          console.error(stack)
        }
      })
  })

  plugin._commandListeners.set('404', async (msg, cmd) => {
    plugin.foxLog(plugin.localeString('fox.0001', plugin.userWithDiscriminator(msg.author).xb16, msg.guild.name, cmd.xb16) + '[FOX#0001]'.x240)
    msg.channel.send(plugin.designs.use('simpleEmbed', plugin.localeString('error'), plugin.localeString('cmd.404', cmd)))
  })

  plugin._commandListeners.set('off', async (msg, cmd) => {
    plugin.foxLog(plugin.localeString('fox.0002', plugin.userWithDiscriminator(msg.author).xb16, msg.guild.name, cmd.xb16) + '[FOX#0002]'.x240)
    msg.channel.send(plugin.designs.use('simpleEmbed', plugin.localeString('error'), plugin.localeString('cmd.off', cmd)))
  })

  plugin._commandListeners.set('use', async (msg, cmd, args) => {
    plugin.foxLog(plugin.localeString('fox.use', plugin.userWithDiscriminator(msg.author).xb16, msg.guild.name, cmd.xb16 + (args.length > 0 ? ' '.xb16 + args.join(' ').xb16 : '')))
  })

  plugin.bot.on('messageCreate', plugin._commandListeners.get('message'))
}
