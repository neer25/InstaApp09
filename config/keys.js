const e = require("express")

if(process.env.NODE_ENV === "production")   // if on production side then exporting prod.js file otherwise dev.js file
{
    module.exports = require("./prod")
}
else
{
    module.exports = require("./dev")
}