const express = require('express');
const app = express(); 
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); 
const mongoose = require('mongoose'); 

// CONFIG
mongoose.connect('mongodb://localhost:27017/photos', {useNewUrlParser: true}); 
app.set('view engine', 'ejs'); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(methodOverride('_method')); 

// MONGOOSE SCHEMA & MODEL
const photoSchema = new mongoose.Schema({
    title: String, 
    image: String,
    date: Date, 
    author: {type: String, default: 'admin'}
}); 

const Photo = mongoose.model('Photo', photoSchema); 

 
// ROUTES
app.get('/', (req, res) => {
    res.redirect('/photos'); 
}); 

// 1. INDEX route
app.get('/photos', (req, res) => {
    Photo.find({}, (err, photos) => {
        if (err) {
            console.log(err); 
        } else {
            res.render('index', {photos: photos}); 
        }
    }); 
}); 

// 2. NEW - add new photo form
app.get('/photos/new', (req, res) => {
    res.render('new'); 
}); 


// 3. CREATE - save photo to the database & redirect
app.post('/photos', (req, res) => {
    Photo.create(req.body.photo, (err, photo) => {
        if(err) {
            console.log('ERROR!'); 
            console.log(err); 
        } else {
            console.log('Saved new pic'); 
            // console.log(photo);
            res.redirect('/photos'); 
        }
    });   
}); 

// 4: SHOW - display more info about a particular photo
app.get('/photos/:id', (req, res) => {
    Photo.findById(req.params.id, (err, photo) => {
        if (err) {
            console.log(err); 
        } else {
            res.render('show', {photo: photo});    
        }
         
    }); 
}); 

// 5: EDIT - display edit form
app.get('/photos/:id/edit', (req, res) => {
    Photo.findById(req.params.id, (err, photo) => {
        if(err) {
            console.log(err); 
        } else {
            res.render('edit', {photo: photo}); 
        }
    }); 
}); 

// 6: UPDATE - find & update the photo in the database & redirect
app.put('/photos/:id', (req, res) => {
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, (err, pic) => {
        if(err) {
            console.error(err); 
        } else {
            // console.log('Updated to: ', req.body.photo); 
            // redirect
            res.redirect('/photos/' + req.params.id); 
        }
    }); 
}); 


// 7: DESTROY - delete the photo from the database & redirect 
app.delete('/photos/:id', (req, res) => {
    Photo.findByIdAndRemove(req.params.id, (err, removed) => {
        if(err) {
            console.log(err); 
        } else {
            console.log(removed, ' has been removed.'); 
            res.redirect('/'); 
        }
    }); 
}); 



app.listen(process.env.PORT, process.env.IP, () => {
    console.log('Turning on the lights...'); 
}); 