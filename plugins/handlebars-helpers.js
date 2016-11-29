var _ = require('lodash');
var Handlebars = require('handlebars');

module.exports = function() {
  var helpers = {
    json: function(value, indentation) {
      return JSON.stringify(value, null, indentation);
    },
    log: function (something) {
      console.log(something);
    },
    getItem: function(child, listName, options) {
      var list = options.data.root.prismic[listName].results;
      var id = child.json.id;

      var item = list.find(item => item.id === id);
      if (!item) throw new Error('Not found');

      return options.fn(this, {
        blockParams: [
          item.data
        ]
      });
    },
    eachItem: function (context, listName, options) {
      var content = '';
      var list = options.data.root.prismic[listName].results;

      context.forEach((child, index) => {
        var id = _.values(child)[0].json.id;
        var item = list.find(item => item.id === id);
        if (!item) throw new Error('Not found');

        content += options.fn(child, {
          data: Object.assign(options.data, {
            index: index + 1
          }),
          blockParams: [
            item.data,
            child,
            id
          ]
        });
      });

      return content;
    },
    concat: function () {
      return Array.from(arguments).slice(0, -1).join('');
    },
    responsiveImage: function (image, options) {
      if (!image) return '';

      var srcset = _(image.json.views).values().push(image.json.main).map(view => {
        return `${view.url} ${view.width}w`;
      }).join(', ');

      var attrs = _.map(options.hash, (value, name) => {
        return `${name}="${value}"`;
      }).join(' ');

      return new Handlebars.SafeString(`<img src="${image.url}" srcset="${srcset}" ${attrs} />`);
    },
    v: function (item) {
      return item && item.json && new Handlebars.SafeString(item.json.value);
    },
    t: function (item) {
      return item && item.html && new Handlebars.SafeString(item.html);
    }
  };

  for(var key in helpers) {
    if(helpers.hasOwnProperty(key)) {
      Handlebars.registerHelper(key, helpers[key]);
    }
  }

  return function(files, metalsmith, done) {
    done();
  };
};
