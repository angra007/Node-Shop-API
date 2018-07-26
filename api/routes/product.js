const express = require ('express');
const route = express.Router ();

const mongoose = require ('mongoose');
const Product = require ('./../models/product')
var {authenticate} = require ('./../middleware/authenticate')

route.get ('/', (req, res, next) => {
    
    Product.find ()
        .select ('name price _id')
        .then ( (result) => {

        const response = {
            count : result.length,
            products : result.map ( (doc) => {
                return {
                    name : doc.name,
                    price : doc.price,
                    _id : doc._id,
                    request : {
                        type : 'GET',
                        url :'http://localhost:3000/product/' + doc._id
                    }
                }
            })
        }

        res.status (200).json (response)
    }).catch ((error) => {
        res.status (500).json (error)
    })
})

route.post ('/',authenticate, (req, res, next) => {
    
    var product = new Product ({
        _id :  new mongoose.Types.ObjectId (),
        name : req.body.name,
        price : req.body.price
    });

    product.save ().then ( (doc) => {
        
        const response = {
            status : 201,
            name : doc.name,
            price : doc.price,
             _id : doc._id,
            request : {
                type : 'GET',
                url :'http://localhost:3000/product/' + doc._id
            }
        }
        
        res.status (201).json (response)
    }).catch ((error) => {
        console.log ('Error : ' + error)
        res.status (500).json ( {
            error : error,
        })
    });
})

route.get ('/:id', authenticate,(req, res, next) => {
    const id = req.params.id;
    console.log (id);
    Product.findById (id).exec ().then ( (result) => {
        res.status (200).json (result)
    }).catch ( (error) => {
        res.status (500).json (error)
    })
})

route.patch ('/:id', authenticate,(req, res, next) => {
    const id = req.params.id;
    
    const updateOps = {}
    console.log (req.body)
    for (const ops of req.body) {
        updateOps [ops.propName] = ops.value;
    }
    Product.update ({
        _id : id
    }, { $set : updateOps}).then ( (result) => {
        res.status (200).json (result)
    }).catch ( (error) => {
        res.status (500).json (error)
    })
})

route.delete ('/:id', authenticate,(req, res, next) => {
    const id = req.params.id;
    Product.remove ( {
        _id : id
    }).then ( (result) => {
        res.status (200).json ( {
            message : 'Successfully Deleted',
            product : result
        })
    }).catch ((error) => {
        res.status (404).json ({
            status : 404,
            message : error.message
        })
    })
})

module.exports = route;