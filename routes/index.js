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



router.get('/', isLoggedIn ,async function(req, res, next) {
  var currentUser = await users.findOne({
    username:req.user.username
  })
  res.render('index',{user:currentUser});
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

router.post('/findUser',async (req,res,next)=>{
  var findUser = await users.findOne({
    username:req.body.data
  })
  if(findUser){
    res.status(200).json({
      isUserThere:true,
      user:findUser
    })
  }
  else{
    res.status(200).json({
      isUserThere:false
    })
  }
})


module.exports = router;
