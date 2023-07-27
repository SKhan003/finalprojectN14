var express = require('express');
var router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoose = require('mongoose');
const users = require('./users');
passport.use(new localStrategy(users.authenticate()))


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
    pic:req.body.pic
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
}),function(req,res,next){});


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


module.exports = router;
