const express=require("express");
const app=express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate =require("ejs-mate");
const Expresserror = require("./utils/ExpressError.js"); 

const listings=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err) => {
    console.log(err)
});


async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res) =>{
    res.send("haii I'am root.");
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


// app.get("/testListing",async(req,res) =>{
//     let sampleListing= new Listing({
//         title:"My new villa",
//         description:"By the Beach",
//         price:1200,
//         location:"calngute,Goa",
//         country:"India",
//         });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("*",(req,res,next)=>{
    next(new Expresserror(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,() =>{
    console.log("server is lisiening on port 8080");
})