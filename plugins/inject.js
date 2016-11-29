var path = require('path');
var crypto = require('crypto');
var Handlebars = require('handlebars');

var allStyles = {};

module.exports = function () {
  Handlebars.registerHelper('injectBackground', injectBackground);

  return function (files, metalsmith, done) {
    for (var file in files) {
      if (!isHtml(file)) continue;
      var data = files[file];
      var hash = hashJSON(data.prismic);
      if (!allStyles[hash]) continue;
      var styles = allStyles[hash];

      var contents = data.contents.toString();
      contents = contents.replace('</head>', `<style>${styles}</style></head>`);
      data.contents = new Buffer(contents);
    }
    allStyles = {};
    done();
  };
};

function injectBackground(className, image, options) {
  var content = `
    .${className} {
      background-image: url(${image.url});
    }
  `;

  var sizes = [];
  var retinaSizes = [];

  for (var viewName in image.json.views) {
    var view = image.json.views[viewName];
    var width2 = view.width / 2;

    retinaSizes[view.width] = `
      @media
      only screen and (-webkit-min-device-pixel-ratio: 2)      and (max-width: ${width2}px),
      only screen and (   min--moz-device-pixel-ratio: 2)      and (max-width: ${width2}px),
      only screen and (     -o-min-device-pixel-ratio: 2/1)    and (max-width: ${width2}px),
      only screen and (        min-device-pixel-ratio: 2)      and (max-width: ${width2}px),
      only screen and (                min-resolution: 192dpi) and (max-width: ${width2}px),
      only screen and (                min-resolution: 2dppx)  and (max-width: ${width2}px) {
        .${className} {
          background-image: url(${view.url});
        }
      }
    `;

    sizes[view.width] = `
      @media only screen and (max-width: ${view.width}px) {
        .${className} {
          background-image: url(${view.url});
        }
      }
    `;
  }

  content += sizes.reverse().join('');
  content += retinaSizes.reverse().join('');

  addStyles(options.data.root.prismic, content);
  return '';
}

function addStyles(prismic, content) {
  var hash = hashJSON(prismic);
  if (!allStyles[hash]) allStyles[hash] = '';
  allStyles[hash] += content;
}

function isHtml(file) {
    return /\.html$/.test(path.extname(file));
}

function hashJSON(json) {
  var hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(json));
  return hash.digest('hex');
}
