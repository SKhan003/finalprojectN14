var mongoose = require("mongoose");

const msgScheema = mongoose.Schema({
    data:String,
    fromUser:String,
    toUser:String
})

module.exports = mongoose.model('msg',msgScheema);