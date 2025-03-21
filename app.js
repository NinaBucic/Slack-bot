require("dotenv").config();
const { App } = require("@slack/bolt");
const { getItems, refreshCache } = require("./sheetsApi");
const { getLikelyItems } = require("./matcher");
const { getMessageForOptions } = require("./composer");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.message(async ({ message, say }) => {
  try {
    if (message.subtype && message.subtype === "bot_message") return;

    const text = message.text.trim();

    if (text.toLowerCase() === "refresh") {
      refreshCache();
      await say("Cache refreshed.");
      return;
    }

    const items = await getItems();
    const likelyItems = getLikelyItems(items, text);
    const responseText = getMessageForOptions(likelyItems, text);

    await say(responseText);
  } catch (error) {
    app.logger.error("Error processing message:", error);
    await say(
      "An error occurred while processing your request. Please try again later."
    );
  }
});

(async () => {
  await app.start();
  app.logger.info("⚡️ Slack bot is running!");
})();
