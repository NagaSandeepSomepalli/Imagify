var router = require('express').Router();
var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Category = mongoose.model('Category');
var User = mongoose.model('User');
var auth = require('../auth');

// add a product
router.post('/', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    var product = new Product(req.body.product);

    return product.save().then(function () {
      return res.json({ product: product.toJSONFor(user) });
    });
  }).catch(next);
});

// return all products
router.get('/', function (req, res, next) {
  Product.find().then(function (Product) {
    return res.json({ products: Product });
  }).catch(next);
});

// return a product
router.get('/:productId', auth.optional, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    Product.findOne(req.params.productId, function (err, product) {
      return res.json({ product: product.toJSONFor(user) });
    }).catch(next);
  })
});

// update product
router.put('/:productId', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(async function (user) {
    Product.findOne(req.params.productId, (err, product) => {
      if (typeof req.body.product.name !== 'undefined') {
        product.name = req.body.product.name;
      }

      if (typeof req.body.product.description !== 'undefined') {
        product.description = req.body.product.description;
      }

      if (typeof req.body.product.unit !== 'undefined') {
        product.unit = req.body.product.unit;
      }

      if (typeof req.body.product.categoryType !== 'undefined') {
        product.categoryType = req.body.product.categoryType
      }

      product.save((err, updated) => {
        return res.json({ product: product.toJSONFor(user) })
      }).catch(next);
    })
  });
});

// delete product
router.delete('/:productId', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    return Product.remove({ _id: req.params.productId }).then(function () {
      return res.sendStatus(204);
    });

  }).catch(next);
});

// Favorite an product
router.post('/:productId/favorite', auth.required, function (req, res, next) {
  var productId = req.params.productId;
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }
    Product.findOne({ _id: productId }, (err, product) => {
      return user.favorite(productId).then(function () {
        return product.updateFavoriteCount().then(function (product) {
          return res.json({ product: product.toJSONFor(user) });
        });
      });
    })
  }).catch(err => console.log(err));
});

// Unfavorite an product
router.delete('/:productId/favorite', auth.required, function (req, res, next) {
  var productId = req.params.productId;

  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }
    Product.findOne({ _id: productId }, (err, product) => {
      return user.unfavorite(productId).then(function () {
        return product.updateFavoriteCount().then(function (product) {
          return res.json({ product: product.toJSONFor(user) });
        });
      });
    })
  }).catch(next);
});

module.exports = router;
