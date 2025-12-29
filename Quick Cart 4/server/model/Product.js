const mongoose = require("mongoose");

const Productschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    compny_name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    prise: {
        type: String,
        required: true,
    },
    offer_prise: {
        type: String,
        required: true,
    },
    images:{
        type : [String],
        required : true,
    },
    ratings:{
          type : String,
        required : true,
    },
     bestseller: {
        type: Boolean,
        default: false,
    }
},
 {
        timestamps : true,
    }
);

const Product = mongoose.model('Product' ,Productschema,)

module.exports = Product;
