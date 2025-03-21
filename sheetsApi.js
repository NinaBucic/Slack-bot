const { google } = require("googleapis");
const fs = require("fs");
require("dotenv").config();

let cachedItems = null;

async function getAuth() {
  const credentials = JSON.parse(
    fs.readFileSync(process.env.GOOGLE_CREDENTIALS_PATH, "utf8")
  );
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return auth.getClient();
}

async function getItems() {
  if (cachedItems) return cachedItems;

  const authClient = await getAuth();
  const sheets = google.sheets({ version: "v4", auth: authClient });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: "Sheet1!A:B",
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  const items = rows.slice(1).map((row) => ({
    name: row[0],
    location: row[1],
  }));

  cachedItems = items;
  return items;
}

function refreshCache() {
  cachedItems = null;
}

module.exports = { getItems, refreshCache };
