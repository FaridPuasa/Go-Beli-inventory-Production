const mongoose = require('mongoose')

const saleSchema = new mongoose.Schema({
    _id:{
        required: false,
        type: String
    },
    salesnumber:{
        required: false,
        type: String
    },

    salesdescription:{
        required: false,
        type: String
    },
    
    salesproduct:{
        required: false,
        type: String
    },

    salesquantity: {
        required: false,
        type: String
    },

    salespriceperunit: {
        required: false,
        type: String
    },

    salespayment:{
        type: Date,
        default: Date.now
    },

    createdAt:{
        type: Date,
        default: Date.now
    },

    salesremarks: {
type: String,
require: false
    }

 
})

module.exports = mongoose.model('sale', saleSchema)