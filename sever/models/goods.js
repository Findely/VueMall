var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var produtSchema = new Schema({
  productId: String,
  productName: String,
  salePrice: Number,
  productImage: String,
  checked: String,
  productNum: Number
});
module.exports = mongoose.model("Good", produtSchema);
