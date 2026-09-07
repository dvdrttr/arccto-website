module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "style.css": "style.css",
    "main.js": "main.js",
    "favicon.svg": "favicon.svg",
    "robots.txt": "robots.txt"
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
