var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var User = mongoose.model('User');

var ProductSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
  categoryType: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  favoritesCount: {type: Number, default: 0},
  unit: String
}, { timestamps: true });

ProductSchema.plugin(uniqueValidator, { message: 'is already taken' });

ProductSchema.methods.updateFavoriteCount = function() {
  var product = this;
  return User.count({favorites: {$in: [product._id]}}).then(function(count){
    product.favoritesCount = count;
    return product.save();
  });
};

ProductSchema.methods.toJSONFor = function (user) {
  return {
    name: this.name,
    description: this.description,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    unit: this.unit,
    favorited: user ? user.isFavorite(this._id) : false,
  };
};

mongoose.model('Product', ProductSchema);
