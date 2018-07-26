const express = require ('express');
const route = express.Router ();



route.get ('/', (req, res, next) => {
    res.status (200).json ( {
        message : 'Orders were fetched'
    })
})


route.post ('/', (req, res, next) => {
    res.status (200).json ( {
        message : 'Order was created'
    })
})

route.get ('/:id', (req, res, next) => {
    
    console.log ('here')
    const id = req.params.id;

    if (id == 'special') {
        res.status (200).json ( {
            message : 'Handling Special ID'
        })
    }
    else {
        res.status (200).json ( {
            message : 'Handling Other ID'
        })
    }
})

route.delete ('/:orderID', (req, res, next) => {
    res.status (200).json ( {
        message : 'Order was deleted'
    })
})

module.exports = route