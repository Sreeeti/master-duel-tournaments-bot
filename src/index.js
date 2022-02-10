require("dotenv").config();

const admin = require("firebase-admin");
const serviceAccount = require("../../master-duel-tournaments-firebase-adminsdk.json");

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

const STATUS = "online";
const GAME = "/create to start";
const DEFAULT_PREFIX = "/";

// initialize app through cloud functions: https://youtu.be/Z87OZtIYC_0?t=186
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

const startClient = () => {
  client.user.setPresence({
    status: STATUS,
  });

  client.user.setActivity({
    name: GAME,
  });

  console.log("MasterDuelTournaments online");
};

const updatePrefix = async (guildId) => {
  try {
    const guildDocument = (
      await firestore.collection("servers").doc(guildId).get()
    ).data();

    if (guildDocument && guildDocument.prefix) {
      return guildDocument.prefix;
    } else {
      try {
        await firestore.collection("servers").doc(guildId).set({
          prefix: DEFAULT_PREFIX,
        });

        return DEFAULT_PREFIX;
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const setNewPrefix = async (userMessage, changePrefixLength, guildId) => {
  const prefixMessage = userMessage.slice(
    // +1 for the whitespace
    changePrefixLength + 1,
    userMessage.length
  );

  if (prefixMessage.length > 3 || prefixMessage.includes(" ")) {
    // TODO: show error message
  } else {
    try {
      await firestore.collection("servers").doc(guildId).set({
        prefix: prefixMessage,
      });
    } catch (error) {
      console.error(error);
      // TODO: show error message to user
    }
  }
};

const showSuccessMessage = () => {
  // TOOD
};

const showError = () => {
  // TODO
};

client.on("ready", () => startClient());

client.on("messageCreate", async (message) => {
  const guildId = message.guild.id;
  let prefix = (await updatePrefix(guildId)) ?? DEFAULT_PREFIX;

  if (message.content.startsWith(prefix)) {
    const userMessage = message.content.slice(1, message.content.length);
    const changePrefix = "changePrefix";

    if (userMessage.startsWith(changePrefix)) {
      await setNewPrefix(userMessage, changePrefix.length, guildId);
    }
  }

  console.log("----");
});

client.login(process.env.DISCORD_TOKEN);
