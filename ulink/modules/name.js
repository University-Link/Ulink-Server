const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');


module.exports = {
    makeRandomName: () => {
        return uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
    }
}