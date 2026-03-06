const crypto = require('crypto');

async function generateUniquePublicId(prefix, model, field, digits = 6) {
  let candidate;

  do {
    const suffix = crypto.randomInt(0, 10 ** digits).toString().padStart(digits, '0');
    candidate = `${prefix}${suffix}`;
  } while (await model.exists({ [field]: candidate }));

  return candidate;
}

module.exports = {
  generateUniquePublicId
};
