const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()
const Listing = require("./models/Listing");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const ListingSchema = require("./schema.js");




const MONGO_URL = process.env.MONGO_URL;
console.log(process.env.MONGO_URL)

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("MongoDB Error:", err);
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

/// main route
app.get("/", (req, res) => {
    res.send("Welcome to the Airbnb Project!");
});

const validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body.listing);

    if (error) {
        let errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errmsg, 400);
    } else {
        next();
    }
};

//Index route
app.get("/listings", wrapAsync(async (req ,res ) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    }));


// new route 
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


// Show route
app.get("/listings/:id", wrapAsync(async (req , res ) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
   
    if (!listing) {
        return res.send("Listing not found");
    }
    res.render("listings/show.ejs", {listing});
}))

// Edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        return res.send("Listing not found");
    }

    res.render("listings/edit", { listing });
}));


//create route
app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req, res) => {
        let listing = req.body.listing;

        listing.image = {
            url: listing.image,
            filename: "listingimage"
        };

        const newListing = new Listing(listing);
        await newListing.save();

        res.redirect("/listings");
    })
);
//update route
app.put(
    "/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listingData = req.body.listing;

        const existingListing = await Listing.findById(id);

        if (!existingListing) {
            return res.send("Listing not found");
        }

        if (
            listingData.image &&
            listingData.image.url &&
            listingData.image.url.trim() !== ""
        ) {
            listingData.image.filename = "listingimage";
        } else {
            listingData.image = existingListing.image;
        }

        await Listing.findByIdAndUpdate(id, listingData);

        res.redirect(`/listings/${id}`);
    })
);

// Delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
     let { id } = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);

    res.redirect("/listings");
}));
// app.get("/testlisting", async (req, res) => { 
//         let sampleListing = new Listing({
//             title: "New villa",
//             description: "By the beach",
//             price: 1200,
//             location: "Calangute, Goa",
//             country: "India"
//         });
    

//         await sampleListing.save();
//         console.log("sample was saved");
//         res.send("Listing saved successfully!");
//     });

app.use((req, res) => {
    res.status(404).send("Page not found");
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});
    

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});