var bodyParser = require("body-parser");
    expressSanitizer = require("express-sanitizer");
    methodOverride = require("method-override");
    expressSanitizer = require("express-sanitizer");
    mongoose   = require("mongoose");
    express    = require("express");
    app        = express();

//app config

mongoose.connect("mongodb://localhost:27017/restful_blog_app",  {useNewUrlParser: true});
app.use(express.static("public"));
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongoose/model-config
var blogSchema = new  mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

//to have a default image --> image: {type: String, default : "url"},

var Blog = mongoose.model("Blog" , blogSchema);

//create obj
/* Blog.create({
    title: "Test blog",
    image: "https://images.unsplash.com/photo-1599814433266-e9abede604d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    body: "testing..........123"
},function(err,Blog){
    if(err){
        console.log(err);
    }else{
        console.log("blog created");
        console.log(Blog);
    }
}); */

//restful routes
app.get("/", function(req,res){
    res.redirect("/blogs");
});


//  INDEX
app.get("/blogs", function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Error.............!!");
        }else{
            res.render("index", {blogs: blogs});
        }
    })
});


//NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//CREATE
app.post("/blogs", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err,newBlog){
        if(err){
            res.render("new");
        } else{
            res.redirect("/blogs");
        }
    });
});

//SHOW
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE
app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DESTROY
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});



app.listen(4201, function(req,res){
    console.log("App is serving at port : 4201");
});