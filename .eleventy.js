module.exports = function(eleventyConfig) {
  // Pass through static assets so they end up in the _site build folder
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/main.js");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  return {
    dir: {
      input: "src",      // Tell Eleventy to look in the src folder for files
      output: "_site",   // The default build folder Cloudflare is already using
      includes: "_includes" // Where Eleventy will look for your nav/footer files
    }
  };
};
