{
  "name": "<%= packageName %>",
  "version": "<%= packageVersion %>",
  "description": "<%= packageDescription %>",
  "main": "index.js",<% if(cli) {%>
  "bin": "cli.js",<% } %>
  "scripts": {
    "test": "gulp test"<% if(cli) {%>,
    "test-cli": "node cli.js"<% } %>
  },
  <% if(repo) { %>"repository": {
    "type": "git",
    "url": "<%= repo %>"
  },<% } %>
  <% if(keywords) { %>"keywords": [<% keywords.split(",").forEach(function(kw, i, arr) { %>
    "<%= kw %>"<% if(i !== (arr.length - 1)) { %>,<% }}); %>
  ],<% } %>
  "author": "<%= author %>",
  "license": "<%= license %>",
  "devDependencies": {
    "gulp": "^3.9.0",
    "gulp-jasmine": "^2.0.1",
    "gulp-plumber": "^1.0.1",
    "is-generator": "^1.0.2"
  },
  "dependencies": {
    "harmonize": "^1.4.2",
    "suspend": "^0.6.1"<% if(cli) { %>,
    "yargs": "^3.13.0"<% } %>
  },
  "engines": {
    "node" : ">=0.11"
  }
}
