function getMessageForOptions(items, query) {
  if (!items || items.length === 0) {
    return `Unfortunately, I couldn't find _${query}_`;
  }

  let message = `Here are the likely candidates for _${query}_:`;
  items.forEach((item) => {
    message += `\n- *${item.name}*: ${item.location}`;
  });

  return message;
}

module.exports = { getMessageForOptions };
