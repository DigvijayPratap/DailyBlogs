//jshint esversion:6
require('dotenv').config()
const path=require("path");
const hbs=require("hbs");
const ejs=require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

let arr = [];

const homeStartingContent = "We Are All So Diffrent, And Yet So Much The Same. Everyone, In Some Way Or Another,Will Experience A Kind Of Pain."

const app = express();

app.set('view engine', 'ejs');

/////////
//const static_path=path.join(__dirname,"../public");//connecting  public folder
//const views_path=path.join(__dirname,"../template/views"); // to use temletes folder
// const partials_path=path.join(__dirname,"../template/partials");
//
 //app.use(express.json());
 app.use(express.urlencoded({extended:false}));
 //app.use(express.static(static_path));  // to use static files
 //app.set("views",views_path); // to use views's files
 ///hbs.registerPartials(partials_path); //to use partials files
//app.set("view engine", "hbs"); // to use handlebar

////////////

app.use(express.static("public/"));


const URI = process.env.MONGODB_URL;

mongoose.connect(URI, {

useNewUrlParser: true, 

useUnifiedTopology: true 

}, err => {
if(err) throw err;
console.log('Connected to MongoDB!!!')
});

const postSchema = {
   heading: {
    type:String,
    required:true
         },
   content:{
    type:String,
    required:true
         }
};
const contactSchema = {
  fullName:{
    type:String,
    required:true
         },
  email: {
    type:String,
    required:true
        },
  subject:{
    type:String,
    required:true
      },
  message:{
    type:String,
    required:true
     }
};
     
const Post = mongoose.model("testApp", postSchema);
const Contact =mongoose.model("messages",contactSchema);

app.get("/" , function(req,res){
  Post.find({}, function(err, foundItems){
    if(err){console.log(err);}
    else{
      res.render("home" , {text: homeStartingContent , posts: foundItems});
    }
  })
 
})
app.get('/home',(req,res)=>{
  
  Post.find({}, function(err, foundItems){
  
  if(err){console.log(err) 
  }
    else{
      res.render("home" , {text: homeStartingContent , posts: foundItems});
    }
  });
});


app.get("/about" , function(req,res){
  res.render("about" );
})

app.get("/contactUs" , function(req,res){
  res.render("contactUs");
})
app.post("/contactUs" , async(req,res)=>{
 
       try{   
               const contact =  new Contact({
                 fullName: req.body.fullname,
                 email: req.body.email,
                 subject:req.body.subject,
                 message:req.body.message
               });
                 const message=await contact.save();
                
                 res.render("welcome");
                
       }
      catch(err){
           console.log(err)
           res.render("error");
        }
  });


app.get("/compose" , function(req,res){
  res.render("compose");
})

app.post("/compose" , async function(req,res){
      try{
           const post = new Post ({
            heading: req.body.Heading,
            content: req.body.Body
             });
            await post.save();
            Post.find({}, function(err, foundItems){
    
            if(err){console.log(err) 
            }
              else{
                res.render("home" , {text: homeStartingContent , posts: foundItems});
              }
            });
         }  
         catch(err){
          console.log(err);
          res.render('error')
         }

})

app.get("/posts/:val" , function(req,res){
  
  Post.findOne({_id:req.params['val']}, function(err, foundItem){
    if(!err){
     // res.render("post" , {text: homeStartingContent , post: foundItem});
      res.render("post" , {heading:foundItem.heading , text :foundItem.content});
    }
    else{
      console.log(err);
      res.render('error');
    }
  })

})

app.post('/search',(req,res)=>{
  const search=req.body.searchBox;
  Post.find({heading:search}, function(err, foundItems){
    if(err){console.log(err);}
    else{
      res.render("home" , {text: homeStartingContent , posts: foundItems});
    }
  })


})

app.get('/welcome',(req,res)=>{
  res.render("welcome");
})

let port = process.env.PORT;
if(port===null || port==""){
  port=3000;
}

app.listen(3000, function() {
  console.log("Server started");
});
