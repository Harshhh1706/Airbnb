const express = require("express");
const mongoose = require("mongoose");

const Listing = require("./models/Listing");
const path = require("path");
const app = express();


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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


app.get("/", (req, res) => {
    res.send("Welcome to the Airbnb Project!");
});


//Index route
app.get("/listings", async (req ,res ) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    });




// new route 
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


// Show route
app.get("/listings/:id", async (req , res ) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})

// edit route 
// Edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        return res.send("Listing not found");
    }

    res.render("listings/edit", { listing });
});

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
    

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});