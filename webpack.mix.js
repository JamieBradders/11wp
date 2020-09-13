// Laravel Mix
const mix = require("laravel-mix");

// Set publich path
mix.setPublicPath("./dist/assets/");

// Compile the scss code
mix
  .sass("./web/resources/styles/main.scss", "./css/")
  .js("./web/resources/js/main.js", "./js/")
  .js("./web/resources/js/wp-preview.js", ".");

// If production, minify css/js
if (mix.inProduction()) {
  mix
    .minify("./dist/assets/css/main.css")
    .minify("./dist/assets/js/main.js")
    .minify("./dist/assets/js/wp-preview.js");
}
