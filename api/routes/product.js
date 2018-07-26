const express = require ('express');
const route = express.Router ();

route.get ('/', (req, res, next) => {
    res.status (200).json ( {
        message : 'Handling Get Request to /products'
    })
})




route.post ('/', (req, res, next) => {
    res.status (200).json ( {
        message : 'Handling Post Request to /products'
    })
})

route.get ('/:id', (req, res, next) => {
    
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


route.patch ('/:id', (req, res, next) => {
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

route.delete ('/:id', (req, res, next) => {
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

module.exports = route;