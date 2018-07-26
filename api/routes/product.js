const express = require ('express');
const route = express.Router ();

const mongoose = require ('mongoose');
const Product = require ('./../models/product')

route.get ('/', (req, res, next) => {
    
    Product.find ().then ( (result) => {
        res.status (200).json (result)
    }).catch ((error) => {
        res.status (500).json (error)
    })
})

route.post ('/', (req, res, next) => {
    
    var product = new Product ({
        _id :  new mongoose.Types.ObjectId (),
        name : req.body.name,
        price : req.body.price
    });

    product.save ().then ( (result) => {
        res.status (200).json ( {
            message : 'Success',
            created : product
        })
    }).catch ((error) => {
        console.log ('Error : ' + error)
        res.status (500).json ( {
            error : error,
        })
    });
})

route.get ('/:id', (req, res, next) => {
    const id = req.params.id;
    console.log (id);
    Product.findById (id).exec ().then ( (result) => {
        res.status (200).json (result)
    }).catch ( (error) => {
        res.status (500).json (error)
    })
})

route.patch ('/:id', (req, res, next) => {
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

route.delete ('/:id', (req, res, next) => {
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