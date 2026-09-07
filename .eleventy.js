module.exports = function(eleventyConfig) {
  // Use an object to map the source file directly to the output root
  eleventyConfig.addPassthroughCopy({
    "src/style.css": "style.css",
    "src/main.js": "main.js",
    "src/favicon.svg": "favicon.svg",
    "src/robots.txt": "robots.txt"
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
