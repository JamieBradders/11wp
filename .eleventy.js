// Eleventy Config
const htmlmin = require("html-minifier");

module.exports = (eleventyConfig) => {
  // Include our static assets
  eleventyConfig.addPassthroughCopy({
    // Include any directories you want to copy through e.g.
    // "web/resources/images": "assets/images",
  });

  eleventyConfig.setBrowserSyncConfig({
    files: ["dist/**/*"],
  });

  // Minify html
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // Change the structure to make it easier to follow
  return {
    dir: {
      input: "web",
      output: "dist",
      includes: "_includes",
      data: "data",
    },
  };
};
