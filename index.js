const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const {
  TOKEN,
  FORUM_CHANNEL_ID,
  WARNING_CHANNEL_ID,
  RECRUITEMENT_BAN_ROLE_ID,
} = process.env;

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

    if (parentId !== FORUM_CHANNEL_ID) return;
    console.log(member.id);
    console.log(ownerId);

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

    if (member.roles.cache.has(RECRUITEMENT_BAN_ROLE_ID)) return;
    await member.roles.add(RECRUITEMENT_BAN_ROLE_ID);
  } catch (error) {
    console.log(error);
  }
});

client.login(TOKEN);
