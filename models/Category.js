var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
  name: String,
  description: String
}, { timestamps: true });

// Requires population of author
CategorySchema.methods.toJSONFor = function (user) {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    createdAt: this.createdAt
  };
};

mongoose.model('Category', CategorySchema);
