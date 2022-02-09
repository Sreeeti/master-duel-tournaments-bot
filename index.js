require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING",
    "GUILDS",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_INVITES",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "GUILD_PRESENCES",
    "GUILD_SCHEDULED_EVENTS",
    "GUILD_VOICE_STATES",
    "GUILD_WEBHOOKS",
  ],
});

client.on("ready", () => {
  client.user.setPresence({
    status: "available",
    activity: {
      name: "@someone",
      type: "PLAYING",
    },
  });

  console.log("SretiBot online");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  console.log("message sent");

  message.channel.send(message.author.toString());
});

client.login(process.env.DISCORD_TOKEN);
