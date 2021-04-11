const config = {};

module.exports = function(eleventyConfig) {
  // Customized Markdown Export.
  let markdownIt = require("markdown-it");
  let md = markdownIt({html: true})
  md.use(require("markdown-it-anchor"));
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return md.render(content);
  });

  // Files to copy
  eleventyConfig.addPassthroughCopy("apple-touch-icon.pngapple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("autocomplete.js");
  eleventyConfig.addPassthroughCopy("local.js");
  eleventyConfig.addPassthroughCopy("local.js");
  eleventyConfig.addPassthroughCopy("macronutrients-carbs-protein-fat.png");
  eleventyConfig.addPassthroughCopy("macros-ui.js");
  eleventyConfig.addPassthroughCopy("macros.js");
  eleventyConfig.addPassthroughCopy("vega.min.js");
  eleventyConfig.addPassthroughCopy("vega.min.js.map");

  // Extensions to copy
  // eleventyConfig.setTemplateFormats(["css", "js", "json", "png"]);

  eleventyConfig.addLiquidFilter("fixDate", function(value){
    value.setTime(value.getTime() + (5*60*60*1000));
    return value; })

  return config;
};
