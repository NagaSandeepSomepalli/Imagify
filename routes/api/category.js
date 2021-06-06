var router = require('express').Router();
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var auth = require('../auth');
var User = mongoose.model('User');

// return a list of category
router.get('/', function (req, res, next) {
  Category.find().then(function (category) {
    return res.json({ category: category });
  }).catch(next);
});

// return a particular category
router.get('/:categoryId', auth.optional, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    Category.findOne(req.params.categoryId, function (err, results) {
      return res.json({ category: results.toJSONFor(user) });
    }).catch(next);
  })
});

// add category
router.post('/', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }
    var category = new Category(req.body.category);
    return category.save().then(function () {
      return res.json({ category: category.toJSONFor() });
    });
  }).catch(next);
});

//update category
router.put('/:categoryId', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(async function (user) {
    Category.findOne(req.params.categoryId, (err, category) => {
      if (typeof req.body.category.name !== 'undefined') {
        category.name = req.body.category.name;
      }

      if (typeof req.body.category.description !== 'undefined') {
        category.description = req.body.category.description;
      }

      category.save((err, updated) => {
        return res.json({ category: category.toJSONFor(user) })
      }).catch(next);
    })
  });
});

// Delete category
router.delete('/:categoryId', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    return Category.remove({ _id: req.params.categoryId }).then(function () {
      return res.sendStatus(204);
    });

  }).catch(next);
});
module.exports = router; 6
