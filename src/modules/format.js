const { User, Guild, Channel, Role } = require('discord.js')

const splitJoin = (string, split, join) => string.split(split).join(join)

module.exports = (pl) => {
    /*
        Experimental function to format any kinds of messages with objects

        e.g. 
        format('{mention} is muted', user) -> '<@!user_id> is muted'
        format('{name} is muted', user) -> 'username is muted'
        format('{name}#{discriminator} is muted', user) -> 'username#discriminator is muted'
    */
    pl.format = (message, objectToFormat) => {
        if (objectToFormat instanceof User) {
            // user specific formatter
            // {name}, {discriminator}, {id}, {mention}

            message = splitJoin(message, '{name}', objectToFormat.username)
            message = splitJoin(message, '{discriminator}', objectToFormat.discriminator)
            message = splitJoin(message, '{id}', objectToFormat.id)
            message = splitJoin(message, '{mention}', `<@!${objectToFormat.id}>`)

            return message
        } else if (objectToFormat instanceof Guild) {
            // guild specific formatter
            // {name}, {id}, {count}, {mention}

            message = splitJoin(message, '{name}', objectToFormat.name)
            message = splitJoin(message, '{count}', objectToFormat.memberCount)
            message = splitJoin(message, '{id}', objectToFormat.id)

            return message
        } else if (objectToFormat instanceof Channel) {
            // channel specific formatter
            // {name}, {id}, {type}

            message = splitJoin(message, '{name}', objectToFormat.name)
            message = splitJoin(message, '{id}', objectToFormat.id)
            message = splitJoin(message, '{type}', objectToFormat.type)
            message = splitJoin(message, '{mention}', `<#${objectToFormat.id}>`)

            return message
        } else if (objectToFormat instanceof Role) {
            // role specific formatter
            // {name}, {id}, {color}, {mention}

            message = splitJoin(message, '{name}', objectToFormat.name)
            message = splitJoin(message, '{id}', objectToFormat.id)
            message = splitJoin(message, '{color}', objectToFormat.color)
            message = splitJoin(message, '{mention}', `<@&${objectToFormat.id}>`)

            return message
        }

        return undefined
    }
}