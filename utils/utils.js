var _ = require('lodash');

// *TEMPLATE-i18n* Returns the language code of a Prismic document
function getLanguageFromTags(doc) {
  var languageTag;
  _.forEach(doc.tags, function(tag) {
    tag = tag.split(':');
    if (tag[0] === 'language') {
      if (languageTag) {
        throw `Document ${doc.uid} has more than one language tag.`;
      }
      languageTag = tag[1];
    }
  });
  return languageTag;
}

function getLocalizedType(type) {
  switch (type) {
    case 'services':
      return 'palvelut';
    case 'clients':
      return 'asiakkaat';
    case 'blog':
      return 'blogi';
    case 'employees':
      return 'tekijat';
    default:
      return type;
  }
}

module.exports = {
    getLanguageFromTags,
    getLocalizedType
};
