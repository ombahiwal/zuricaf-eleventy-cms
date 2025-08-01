const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();

module.exports = function(eleventyConfig) {
  // 1) Safely render any Markdown string; return empty string otherwise
  eleventyConfig.addFilter("markdownify", content => {
    if (typeof content !== "string") {
      return "";
    }
    return md.render(content);
  });

  // 2) Pass through static assets
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
