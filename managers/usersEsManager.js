const client = require('./elasticSearchManager');

module.exports = {
  async getSuggestedNames(name) {
    const { body } = await client.search({
      index: 'names',
      body: {
        suggest: {
          namesSuggests: {
            prefix: name,
            completion: { field: 'name' },
          },
        },
      },
    });
    return body.suggest.namesSuggests[0].options.map(({ text }) => text);
  },
};
