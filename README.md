# Slack Bot with Google Sheets Integration

This project is a Slack bot built using Node.js and the Slack Bolt framework (Socket Mode). It integrates with Google Sheets to fetch a list of items, uses fuzzy matching to determine the best candidate(s) based on a user query, and sends a response back to the user.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Slack App Setup](#slack-app-setup)
- [Google Sheets Setup](#google-sheets-setup)
- [Installation & Configuration](#installation--configuration)
- [Running the Application](#running-the-application)
- [How It Works](#how-it-works)
- [Troubleshooting](#troubleshooting)

## Features

- **Socket Mode**: Communicates with Slack without exposing a public HTTP endpoint.
- **Google Sheets Integration**: Retrieves data (e.g., item names and locations) from a Google Sheet.
- **Fuzzy Matching**: Uses Fuse.js to find the best matching items based on user input.
- **Caching**: Implements in-memory caching to reduce redundant API calls to Google Sheets.
- **Error Handling**: Gracefully handles errors by logging and notifying users in Slack.

## Prerequisites

Before setting up this project, ensure you have:

- [Node.js](https://nodejs.org/) installed.

## Slack App Setup

1. **Create a Slack App:**

   - Visit [Slack API: Your Apps](https://api.slack.com/apps) and click **Create New App**.
   - Choose **From scratch** and provide an app name and select your workspace.

2. **Configure Basic Settings:**

   - Under **Basic Information**, note down your **Signing Secret**.

3. **OAuth & Permissions:**

   - Navigate to the OAuth & Permissions on the left sidebar and scroll down to the **Bot Token Scopes** section. Click **Add an OAuth Scope**.

   - Add necessary scopes such as:
     - `chat:write`
     - `im:history`
   - Install (or Reinstall) the app into your workspace to update token permissions. Note down your **Bot User OAuth Access Token** (starting with `xoxb-...`).

4. **Enable Socket Mode:**

   - In **Settings** > **Socket Mode**, enable Socket Mode.
   - Go to **Basic Information** and scroll down under the App-Level Tokens section and click **Generate Token and Scopes** to generate an app token. Add the `connections:write` scope to this token and note down your **App-Level Token** (starting with `xapp-...`).

5. **Event Subscriptions:**
   - Under **Event Subscriptions**, toggle the switch labeled **Enable Events**.
   - Scroll down to **Subscribe to Bot Events** and select `message.im` (for direct messages).
   - **Save changes** and reinstall the app if needed.

If you have trouble, here is more detailed documentation: https://tools.slack.dev/bolt-js/getting-started/

## Google Sheets Setup

1. **Create or Identify Your Google Sheet:**

   - Create a new Google Sheet or use an existing one.
   - Ensure the first row contains headers (e.g., `name` and `location`) and set the sheet name to `Sheet1`.
   - Note down the **Spreadsheet ID** from the URL (the long string between `/d/` and `/edit`).

2. **Enable Google Sheets API & Create Service Account:**

   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Navigate to **APIs & Services** > **Library** and enable the **Google Sheets API**.
   - Under **APIs & Services** > **Credentials**, click **Create Credentials** > **Service Account**.
   - Follow the prompts, then in the service account details, go to **Keys** and click **Add Key** > **Create new key** (choose JSON).
   - Download the JSON file and save it in your project folder (e.g., as `credentials.json`).

3. **Share the Sheet:**
   - Open your Google Sheet, click **Share**, and add your `client_email` (found in the JSON file) with at least **Viewer** access.

## Installation & Configuration

1.  **Clone the Repository:**

    ```bash
    git clone git@github.com:NinaBucic/Slack-bot.git
    cd Slack-bot
    npm install
    ```

2.  **Set Up Environment Variables:**

    Create a `.env` file in the root directory of your project (do not commit this file). You can use the provided `.env.example` as a template.

3.  **Configuration File:**

    In `config.js`, you can define parameters that control the bot’s behavior.

## Running the Application

To start the Slack bot, run:

```bash
node app.js
```

You should see a log message:

```csharp
[INFO]  bolt-app ⚡️ Slack bot is running!
```

Now, your bot is active. In Slack, send a direct message to interact with it. You can also type "refresh" to clear the cached Google Sheets data.

## How It Works

- **Slack Bot Initialization:**

  The app is initialized in Socket Mode using Slack Bolt. It listens for incoming messages and triggers appropriate handlers.

- **Message Handling:**

  The bot contains message handler that:

  - Ignores messages from other bots.
  - Clears the cache on the "refresh" command.
  - Retrieves data from Google Sheets (using caching).
  - Applies fuzzy matching via Fuse.js.
  - Composes and sends a response message based on the matching results.

- **Google Sheets Integration & Caching:**

  The `sheetsApi.js` module:

  - Authenticates with the Google Sheets API using your credentials.
  - Retrieves and caches data from the specified Google Sheet.
  - Provides a `refreshCache()` function to clear the cached data.

- **Fuzzy Matching:**

  The `matcher.js` module uses Fuse.js to compare user queries with sheet items. The results are sorted from best to worst match based on the `MIN_SCORE` threshold defined in the configuration.

## Troubleshooting

- **Range Parsing Error:**
  If you see an error like `Unable to parse range: Sheet1!A:B`, verify that the sheet name in your Google Sheet exactly matches the name used in your code. Update the range accordingly (e.g., if your sheet is named "Data", use `"Data!A:B"`).

- **Missing Environment Variables:**
  Ensure that your `.env` file is correctly set up and that you have installed the dotenv package.

- **Permission Issues:**
  Make sure the Google Sheet is shared with the service account email specified in your credentials.
