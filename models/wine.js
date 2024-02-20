const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let wineSchema = new Schema( //The model for my wine

    {
        name: {
            type: String
        },
        year: {
            type: Number
        },
        country: {
            type: String
        },
        price: {
            type: Number
        },
        inStock: {
            type: Boolean
        }
    }
);

module.exports = mongoose.model('Wine', wineSchema); //export the model