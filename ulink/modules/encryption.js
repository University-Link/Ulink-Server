const crypto = require('crypto');

const makeSalt = () => {
    return crypto.randomBytes(32).toString('hex');
};

function encryption(password, salt) {
    const key = crypto.pbkdf2Sync(password, salt.toString(), 100000, 32, 'sha512');
    return key.toString('hex');
}

module.exports = {
    makeSalt: makeSalt,
    encryption: encryption,
};
