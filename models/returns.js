const mongoose = require('mongoose')

const balikSchema = new mongoose.Schema({
    _id:{
        required: false,
        type: String
    },
    balikproduct:{
        required: false,
        type: String
    },

    balikreason:{
        required: false,
        type: String
    },

    balikdatetogorush: {
        required: false,
        type: Date
    },

    balikdatetoorgin: {
        required: false,
        type: Date
    },

    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Balik', balikSchema)