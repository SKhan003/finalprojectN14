var express = require('express');
var router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoose = require('mongoose');
const users = require('./users.js');
const msgModel = require('./msg.js');
const multer = require("multer");
passport.use(new localStrategy(users.authenticate()))


// multer initializing 

function fileFilter (req, file, cb) {
  if(file.mimetype==="image/png" || file.mimetype ==="image/jpg" || file.mimetype === "image/jpeg"){
    cb(null, true)                                            
  } 
  else{
    cb(new Error('I don\'t have a clue!'))
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    var dt = new Date();
    var fn = Math.floor(Math.random()*10000000) + dt.getTime() + file.originalname;
    cb(null,fn)
  } 
})

const upload = multer({ storage: storage , fileFilter : fileFilter})


// multer ending 


async function clearSockets(){
  var allUser = await users.find({})
  await Promise.all(  
    allUser.map(async user =>{
      user.currentSocket = ''
      await user.save()
    })
  )
}
clearSockets();



/* GET home page. */
router.get('/', isLoggedIn ,function(req, res, next) {
  users.findOne({
    username:req.session.passport.user
  }).then(loggedInUser=>{
    res.render('index',{user:loggedInUser});
  })
});

router.get('/login',function(req,res,next){
  res.render('login');
})


router.post('/register',function(req,res,next){
  var newUser = {
    username:req.body.username,
    pic:req.body.pic,
    email:req.body.email
    
  };
  users.register(newUser,req.body.password)
  .then(function(user){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/')
  })
  })
  .catch(function(err){
    res.send(err);
  })
});

router.get('/register', (req, res, next) => {
  res.render('register')
})


router.post('/login',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login'
}),function(req,res,next) {});


router.post('/uploads',isLoggedIn,upload.single('filename'),(res,req)=>{
  users.findOne({username:req.session.passport.user})
  .then(function(loggedUser){
    loggedUser.pic = req.file.filename;
    loggedUser.save();
  })
})


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){  
    return next();
  }
  else{
    res.redirect('/login');
  }
}

router.post('/findUser',isLoggedIn,async (req,res,next)=>{
  var  findUsename = req.body.username
  var findUser = await users.findOne({
    username:findUsename
  })
  if(findUser){
    res.status(200).json({
      user:findUser,
    })
  }
  else{
    res.status(404).json({
      message:'user not found'
    })
  }
})

router.post('/findChats',isLoggedIn ,async(res,req,next)=>{
  var oppositeUser = await users.findOne({
    username:req.body.oppositeUser
  })

  var chats = await msgModel.find({
    $or:[{
      toUser:req.username,
      fromUser:oppositeUser.username
    },{
      toUser:oppositeUser.username,
      fromUser:req.user.username
    }]
  })
  console.log(chats)

})


module.exports = router;
