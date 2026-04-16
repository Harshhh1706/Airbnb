const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: { 
        type: String,
        required: true
    },
    
    description: String,

    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1761960083519-1edf2f46a807?q=80&w=686&auto=format&fit=crop"
        }
    },

    price: { 
        type: Number, 
        required: true 
    },

    location: { 
        type: String, 
        required: true 
    },

    country: { 
        type: String, 
        required: true 
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;