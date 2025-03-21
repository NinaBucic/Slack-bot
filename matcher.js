const Fuse = require("fuse.js");
const config = require("./config");

function getLikelyItems(items, query) {
  const options = {
    keys: ["name"],
    threshold: config.MIN_SCORE,
  };
  const fuse = new Fuse(items, options);
  const results = fuse.search(query);

  return results.slice(0, config.MAX_ITEMS).map((result) => result.item);
}

module.exports = { getLikelyItems };
