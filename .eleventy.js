const config = {};

module.exports = function(eleventyConfig) {
  // Customized Markdown Export.
  let markdownIt = require("markdown-it");
  let md = markdownIt({html: true})
  md.use(require("markdown-it-anchor"));
  eleventyConfig.setLibrary("md", md);

  pathPrefix: "/macros/";

  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return md.render(content);
  });

  // Files to copy
  eleventyConfig.addPassthroughCopy("actuals.json");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.pngapple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("autocomplete.js");
  eleventyConfig.addPassthroughCopy("foods.json");
  eleventyConfig.addPassthroughCopy("icons-192.png");
  eleventyConfig.addPassthroughCopy("icons-512.png");
  eleventyConfig.addPassthroughCopy("macronutrients-carbs-protein-fat.png");
  eleventyConfig.addPassthroughCopy("macros-ui.js");
  eleventyConfig.addPassthroughCopy("macros.js");
  eleventyConfig.addPassthroughCopy("manifest.webmanifest");
  eleventyConfig.addPassthroughCopy("screenshot1.png");
  eleventyConfig.addPassthroughCopy("targets.json");
  eleventyConfig.addPassthroughCopy("vega.min.js");
  eleventyConfig.addPassthroughCopy("vega.min.js.map");

  // Extensions to copy
  // eleventyConfig.setTemplateFormats(["css", "js", "json", "png"]);

  eleventyConfig.addLiquidFilter("fixDate", function(value){
    value.setTime(value.getTime() + (5*60*60*1000));
    return value; })

  return config;
};
