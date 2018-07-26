const express = require ('express');
const app = express ();
const morgan = require ('morgan');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');



const productRoutes = require ('./api/routes/product');
const orderRoutes = require ('./api/routes/orders')


mongoose.connect ('mongodb+srv://angraankit:' 
    + 'JcnLujrDwsRK9VWm' +
     '@cluster0-0cjpd.mongodb.net/test?retryWrites=true', {
        useNewUrlParser : true
     });

app.use (morgan ('dev'));

app.use (bodyParser.urlencoded({
    extended : false
}));
app.use (bodyParser.json());


app.use ((res, req, next) => {
    res.header ('Access-Control-Allow-Origin','*');
    res.header (
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header ('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status (200).json ({

        });
    }
    next ();
})

app.use ('/product',productRoutes);
app.use ('/order',orderRoutes)




app.use ((req, res, next) => {
    const error = new Error ('Not Found');
    error.status = 404;
    next (error)
});

app.use ((error , req, res, next) => {
    res.status (error.status || 501);
    res.json ({
        error: {
            message : error.message || 'Something went wrong. Please try again',
            status : error.status
        }
    })
});

module.exports = app;