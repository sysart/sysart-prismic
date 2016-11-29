#!/usr/bin/env node
'use strict';

// Setup env variables from local .env file. After this call, all variables
// from .env file can be access via `process.env`.
var dotEnvLoaded = require('dotenv').config({
    silent: true,
});
console.log('.env file loaded:', dotEnvLoaded);

var autoprefixer = require('metalsmith-autoprefixer');
var beautify = require('metalsmith-beautify');
var ignore = require('metalsmith-ignore');
var layouts = require('metalsmith-layouts');
var markdown = require('metalsmith-markdown');
var s3 = require('metalsmith-s3');
var sass = require('metalsmith-sass');
var concat = require('metalsmith-concat');
var browserify = require('metalsmith-browserify');

var metalsmithPrismicServer = require('metalsmith-prismic-server');

var handlebarsHelpers = require('./plugins/handlebars-helpers');
var inject = require('./plugins/inject');
var utils = require('./utils/utils.js');

var argv = require('process').argv;

var config = {
  // See src/config.js in metalsmith-prismic-server for all options

  /**
   * Configure metalsmith-prismic linkResolver
   * Generates prismic links and paths for the files in a prismic collections
   *
   * E.g. The paths for each blog-post in the blog-post.md collection will be generated as:
   *      /blog-post/my-second-blog-post/index.html
   *
   * E.g. The paths for prismic author links will be generated as:
   *      /author/bob/
   *
   * Note: the linkResolver does not affect single prismic files
   *
   * *TEMPLATE* adjust this example function to suit your prismic content and folder structures
   * *TEMPLATE* If omitted, links and paths will be generated with the default format of:
   * *TEMPLATE* "/<document.type>/<document.id>/<document.slug>"
   */
  prismicLinkResolver (ctx, doc) {
    if (doc.isBroken) {
      return;
    }

    if (doc.type === 'home-page') {
      return '/';
    }

    if (!doc.uid) {
      throw new Error(`Missing uid: ${doc.type}`);
    }

    var language = utils.getLanguageFromTags(doc);
    var type = utils.getLocalizedType(doc.type);
    var filename = doc.data ? 'index.html' : '';

    if (doc.type.match(/-page$/)) {
      return `/${doc.uid}/${filename}`;
    } else {
      return `/${type}/${doc.uid}/${filename}`;
    }
  },

  // Metalsmith plugins passed to metalsmithPrismicServer
  plugins: {
    common: [
      // Render markdown files to html
      markdown(),
      // Register handlebars helpers
      handlebarsHelpers(),
      // Render with handlebars templates
      layouts({
        engine: 'handlebars',
        directory: 'layouts',
        partials: 'partials',
        pattern: '**/*.html'
      }),
      inject(),
      // Style using sass
      sass({
        outputDir: 'style/',
        includePaths: [
          'node_modules/bootstrap-sass/assets/stylesheets'
        ]
      }),
      concat({
        files: 'style/**/*.css',
        output: 'style/style.css'
      }),
      // Autoprefix styles
      autoprefixer({
        // Support browsers based on these versions
        browsers: ['last 2 versions',
                   '> 5%']
      }),
      browserify('script/index.js', [
        './src/js/index.js'
      ]),
      // Prettify output
      beautify({
        indent_size: 2,
        indent_char: ' ',
        wrap_line_length: 0,
        end_with_newline: true,
        css: true,
        html: true
      }),
      // Ignore some files
      ignore([
        '**/*.scss',
        'js/**/*.js'
      ])
    ],
    deploy: [
      s3({
        action: 'write',
        bucket: provess.env.S3_BUCKET,
        region: process.env.S3_REGION
      })
    ]
  }
};

function run() {
  // Start server
  switch (argv[2]) {
    case 'dev':
      metalsmithPrismicServer.dev(config);
      break;
    case 'prod':
      metalsmithPrismicServer.prod(config);
      break;
    case 'build':
      metalsmithPrismicServer.build(config, []);
      break;
    default:
      console.error(`invalid command '${argv[2]}'`);
  }
}

if (require.main === module) {
  // Only run server if run from script
  run();
}
