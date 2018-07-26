const express = require ('express');
const route = express.Router ();

const mongoose = require ('mongoose');
const Order = require ('./../models/order')
const Product = require ('./../models/product')
var {authenticate} = require ('./../middleware/authenticate')

route.get ('/', (req, res, next) => {
    
    Order.find ()
    .select ('product quantity _id')
    .exec().then ( (result) => {
        
        var response = {
            _id : result._id,
            count : result.length,
            
            order : result.map ( (doc) => {
                return {
                    quantity : doc.quantity,
                    productID : doc.product,
                    _id : doc._id,
                    request : {
                        type : 'GET',
                        url :'http://localhost:3000/order/' + doc._id
                    }
                }
            })
            
        }
        
        res.status (200).json (response)
    }).catch ( (error) => {

    })
    
})

route.post ('/', authenticate, (req, res, next) => {

    Product.findById (req.body.productID).exec ().then ( (product) => {
        
        if (product) {
            const order = new Order ( {
                _id : new mongoose.Types.ObjectId (),
                quantity : req.body.quantity,
                product : req.body.productID
            });
        
            order.save ().then ( (result) => {
                var response = {
                    status : 201,
                    message : 'Successfully Created Order',
                    order : {
                        quantity : result.quantity,
                            productID : result.product,
                            _id : result._id,
                            request : {
                                type : 'GET',
                                url :'http://localhost:3000/order/' + result._id
                            }
                    }
                }
                res.status (200).json (response)
            }).catch ( (error) => {
        
                var response = {
                    status : error.status | 500,
                    message : error.message | 'Something went wrong. Please try again'
                }
        
                res.status (error.status | 500).json (response)
            });
        }
        else {
            var response = {
                status :  205,
                message : 'Invalid Product ID'
            }
            res.status (205).json (response)
        }    
    }).catch ( (error) => {
        var response = {
            status : error.status | 500,
            message : error.message | 'Something went wrong. Please try again'
        }
        res.status (error.status | 500).json (response)
    })
});

route.get ('/:id', authenticate, (req, res, next) => {
    
    const id = req.params.id;

     Order.findById (id).exec ().then ( (order) => {
       
        if (order) {
            res.status (200).json (order)
        }
        else {
            var response = {
                status :  206,
                message : 'Invalid Order ID'
            }
            res.status (206).json (response)
        }    
    }).catch ( (error) => {
        //console.log ("error");
        var response = {
            status : error.status | 500,
            message : error.message | 'Something went wrong. Please try again'
        }
        res.status (error.status | 500).json (response)
    })
})

route.delete ('/:orderID', (req, res, next) => {
    res.status (200).json ( {
        message : 'Order was deleted'
    })
})

module.exports = route