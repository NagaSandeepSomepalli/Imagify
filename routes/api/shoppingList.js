var router = require('express').Router();
var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var ShoppingList = mongoose.model('ShoppingList')
var User = mongoose.model('User');
var auth = require('../auth');

// add a product
router.post('/', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then((user) => {
        if (!user) { return res.sendStatus(401); }

        var shoppingList = new ShoppingList(req.body.shoppingList);

        return shoppingList.save().then(() => {
            return res.json({ shoppingList: shoppingList.toJSONFor(user) });
        });
    }).catch(next);
});

// return all shopping lists
router.get('/', function (req, res, next) {
    ShoppingList.find().populate({
        path: 'productsAdded.products',
        model: 'Product'
    }).exec((err, results) => {
        return res.json({ shoppinglist: results });
    }).catch(next);
});

// return a shopping lists
router.get('/:shoppinglistId', auth.optional, function (req, res, next) {
    User.findById(req.payload.id).then((user) => {
        ShoppingList.findOne(req.params.shoppinglistId).populate({
            path: 'productsAdded.products',
            model: 'Product'
        }).exec((err, results) => {
            return res.json({ shoppinglist: results });
        }).catch(next);
    })
});

// update shopping lists
router.put('/:shoppinglistId', auth.required, function (req, res, next) {
    console.log('---here 2')
    User.findById(req.payload.id).then((user) => {
        ShoppingList.findOne(req.params.shoppinglistId, (err, shoppingList) => {
            if (typeof req.body.shoppingList.name !== 'undefined') {
                shoppingList.name = req.body.shoppingList.name;
            }

            if (typeof req.body.shoppingList.shoppingStatus !== 'undefined') {
                shoppingList.shoppingStatus = req.body.shoppingList.shoppingStatus;
            }

            if (typeof req.body.shoppingList.productsAdded !== 'undefined' && req.body.shoppingList.productsAdded.length > 0) {
                shoppingList.productsAdded = req.body.shoppingList.productsAdded;
            }

            shoppingList.save((err, updated) => {
                return res.json({ ShoppingList: shoppingList.toJSONFor(user) })
            }).catch(next);
        })
    });
});

// add new product to shopping list
router.put('/:shoppinglistId/:productId', auth.required, function (req, res, next) {
    console.log('--here in request')
    User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }
        return ShoppingList.findOne({ _id: req.params.shoppinglistId }).exec(function (err, shoppinglist) {
            shoppinglist.productsAdded = shoppinglist.productsAdded.concat(req.body.products)
            shoppinglist.save((err, updated) => {
                return res.json({ ShoppingList: shoppinglist.toJSONFor(user) })
            }).catch(next);
        });
    }).catch(next);
});

// delete shopping lists
router.delete('/:shoppinglistId/:productId', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        let productId = req.params.productId
        if (!user) { return res.sendStatus(401); }
        return ShoppingList.findOne({ _id: req.params.shoppinglistId }).exec(function (err, shoppinglist) {
            shoppinglist.productsAdded = shoppinglist.productsAdded.filter(function(value, index, arr){ 
                return String(value.product) !== String(productId)
            });
            shoppinglist.save((err, updated) => {
                return res.json({ ShoppingList: shoppinglist.toJSONFor(user) })
            }).catch(next);
        });
    }).catch(next);
});

module.exports = router;
