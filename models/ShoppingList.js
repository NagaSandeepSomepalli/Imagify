var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  status: {
    type: String,
    index: true,
    enum: ['purchased', 'not purchased'],
    default: 'not purchased'
  },
  content: Number,
  unit: String,
  products: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
}, { _id: false });

var shoppinglistSchema = new mongoose.Schema({
  name: { type: String, index: true },
  shoppingStatus: { type: String, default: 'pending', enum: ['pending', 'inprogress', 'finished'] },
  productsAdded: [productSchema]
}, { timestamps: true });

// Requires population of author
shoppinglistSchema.methods.toJSONFor = function (user) {
  return {
    id: this._id,
    name: this.name,
    createdAt: this.createdAt,
  };
};

mongoose.model('ShoppingList', shoppinglistSchema);