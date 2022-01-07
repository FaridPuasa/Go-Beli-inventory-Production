const mongoose = require('mongoose')
const { StringDecoder } = require('string_decoder')

const productSchema = new mongoose.Schema({
    _id:{
        required: false,
        type: String
    },
    
    title:{
        required: false,
        type: String
    },

    description:{
        required: false,
        type: String
    },

    quantityonhand: {
        required: false,
        type: String
    },

    restock: {
        required: false,
        type: String
    },

    createdAt:{
        type: Date,
        default: Date.now
    },

    sold: {
type: String,
require: false
    },

payment: {
    type: String,
    required: false
},

remarks: {
    required: false,
    type: String
}

})

module.exports = mongoose.model('Product', productSchema)