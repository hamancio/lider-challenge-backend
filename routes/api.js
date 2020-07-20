// Import dependencies
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://hamancio:matrix00@localhost:27017/promotions?authSource=admin&readPreference=primary&ssl=false';

// Connect to mongodb
mongoose.connect(dbHost, function(err, db) {
    if (err) {
        console.log('Unable to connect to the server. Please start the server. Error:', err);
    } else {
        console.log('Connected to Server successfully!');
    }
});

// create mongoose schema
const prodSchema = new mongoose.Schema({
    "id": Number,
    "brand": String,
    "description": String,
    "image": String,
    "price": Number,
    "sale": Boolean
  });

// create mongoose model
const Products = mongoose.model('products', prodSchema);

/* GET all products by filter. */
router.get('/products/:filter', (req, res) => {
    const term = req.params.filter;
        const numeric = /^\d+$/.test(term);
        const regex = new RegExp(term,'i');
        const palindrome = isPalindrome(term);
        if(numeric){
            Products.find({
                $or: [{
                    'id': {
                        $in: term
                    }
                }
            ]
            }, (err, products) => {
                if (err) res.status(500).send(error)
        
                products.forEach(function(itm){
                    itm.sale = palindrome;
                    ((palindrome) ? itm.price = itm.price /2: itm.price = itm.price)
                   });

                res.status(200).json(products);
            });
    
        }else{
            Products.find({
                $or: [{
                    'brand': {
                        $in: regex
                    }
                },
                {
                    'description': {
                        $in: regex
                    }
                }
            ]
            }, (err, products) => {
                if (err) res.status(500).send(error)   
                 products.forEach(function(itm){
                    itm.sale = palindrome;
                    ((palindrome) ? itm.price = itm.price /2: itm.price = itm.price)
                   });

                res.status(200).json(products);
            });
    
        }
    

    
    
});

function isPalindrome(str) {
    var checkSpecial = str.replace(/[^A-Za-z0-9]/g, '');
    var checkPalindrome = checkSpecial.split('').reverse().join('');
    return checkSpecial == checkPalindrome;
  }


module.exports = router;
