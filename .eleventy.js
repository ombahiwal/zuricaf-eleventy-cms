const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({ html: true, linkify: true });


module.exports = function(eleventyConfig) {
  
  eleventyConfig.addFilter("markdown", (content = "") => md.render(String(content)));

  const MONTHS_DE = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  eleventyConfig.addFilter("date", (dateInput, format) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (format === "yyyy-MM-dd") return d.toISOString().slice(0, 10);
    if (format === "d. MMMM yyyy") return `${d.getDate()}. ${MONTHS_DE[d.getMonth()]} ${d.getFullYear()}`;
    return d.toISOString();
  });
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
