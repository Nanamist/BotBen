const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("loads songs from youtube"),
    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a VC to use this command")

        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)
        let embed = new MessageEmbed()

        let url = "https://www.youtube.com/watch?v=jHbpWb3ZNGY"
        let result = await client.player.search(url, {
            requestedBy: "Bot",
            searchEngine: QueryType.YOUTUBE_VIDEO
        })
        if (result.tracks.length === 0)
            return interaction.editReply("No results")

        const song = result.tracks[0]
        await queue.addTrack(song)
        embed
            .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}` })
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
    }
}