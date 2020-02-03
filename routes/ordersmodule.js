const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


var orderSchema = new mongoose.Schema({
    orderNumber : Number,
    orderDuedate : Date,
    customerName : String,
    customerAddress : String,
    customerPhone : String,
    orderTotal : Number
});

var Order = mongoose.model('Order', orderSchema);

// get all orders
router.get('/', (req, res) => {
    Order.find(function (err, documents) {
        if (err) return console.log(err);
        res.send(documents).status(200)
    });
});


// add order/orders/search order
router.post('/', (req, res) => {
if (req.body.length > 1) {
        var orders = req.body;
        console.log(orders)
        Order.insertMany(orders, function batchInsert(err , documents){
            if(err) return console.log(err);
            res.send(documents).status(200)
        });
    }
    else {
        var order = new Order(req.body);
        order.save(function (err, documents) {
            if (err) return console.log(err);
            res.send(documents).status(200);
        })
    }
})

// delete order
router.delete('/' , (req , res)=>{
    Order.deleteOne((req.body) , function(err , response){
        if(err) return console.log(err);
        res.send(response).status(200);
    })
})

module.exports = router;