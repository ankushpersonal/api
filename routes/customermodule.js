const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


var customerSchema = new mongoose.Schema({
    name: String,
    age: Number,
    sex: String,
    dob: Date
});

var Customer = mongoose.model('Customer', customerSchema);

// get all customers
router.get('/', (req, res) => {
    Customer.find(function (err, documents) {
        if (err) return console.log(err);
        res.send(documents).status(200)
    });
});


// add customer/customers/search customer
router.post('/', (req, res) => {
    if(req.query){
        console.log('search operation' , req.query);
        Customer.find((req.query) , function(err , documents){
            if(err) return console.log(err);
            res.send(documents).status(200);
        })
    }
    else if (req.body.length > 1) {
        var customers = req.body;
        Customer.insertMany(customers, function batchInsert(err , documents){
            if(err) return console.log(err);
            res.send(documents).status(200)
        });
    }
    else {
        var customer = new Customer(req.body);
        customer.save(function (err, documents) {
            if (err) return console.log(err);
            res.send(documents).status(200);
        })
    }
})

// delete customer
router.delete('/' , (req , res)=>{
    Customer.deleteOne((req.body) , function(err , response){
        if(err) return console.log(err);
        res.send(response).status(200);
    })
})




// Customer.find({"name" : /^sam/} , function(err , response){
//     if(err) return console.log(err);
//     console.log('record found');
// })




module.exports = router;