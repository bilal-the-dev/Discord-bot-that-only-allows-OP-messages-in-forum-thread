const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const {
  TOKEN,
  FORUM_CHANNEL_IDS,
  WARNING_CHANNEL_ID,
  ROLE_TO_ADD,
  ROLE_TO_REMOVE,
} = process.env;

const channelIdArray = FORUM_CHANNEL_IDS.split(",");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(
    `Ready! Logged in as ${readyClient.user.tag} (${readyClient.user.id})`
  );
});

client.on(Events.MessageCreate, async (message) => {
  try {
    const {
      channel: { parentId, ownerId },
      member,
      guild,
    } = message;

    if (!channelIdArray.includes(parentId)) return;

    if (member.id === ownerId) return console.log("OP sent a message");

    await message.delete();

    const warningChannel = guild.channels.cache.get(WARNING_CHANNEL_ID);
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setAuthor({
        name: `${member.displayName}`,
        iconURL: `${member.displayAvatarURL()}`, // Replace with the avatar URL or desired image
      })
      .setTitle("Rise of Kingdom Manager")
      .setThumbnail(member.displayAvatarURL())
      .setDescription(
        `${member.displayName} was found sending message in ${
          message.channel
        } (<t:${Math.floor(Date.now() / 1000)}:R>) while he was not OP 🫨`
      )
      .setFooter({
        text: "Recruitement Manager",
      });

    await warningChannel.send({ content: member.toString(), embeds: [embed] });

    if (!member.roles.cache.has(ROLE_TO_ADD))
      await member.roles.add(ROLE_TO_ADD);

    if (member.roles.cache.has(ROLE_TO_REMOVE))
      await member.roles.remove(ROLE_TO_REMOVE);
  } catch (error) {
    console.log(error);
  }
});

client.login(TOKEN);
