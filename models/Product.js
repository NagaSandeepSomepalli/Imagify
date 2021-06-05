var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var User = mongoose.model('User');

var ProductSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
  categoryType: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  unit: String
}, { timestamps: true });

ProductSchema.plugin(uniqueValidator, { message: 'is already taken' });

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
