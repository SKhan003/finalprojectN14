const io = require( "socket.io" )();
const users = require('./routes/users')
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log( "A user connected" );
    socket.on('newUserConnect', async(msg)=>{
        var connectedUser = await users.findOne({
            username:msg.username
        })
        connectedUser.currentSocket = socket.id
        await connectedUser.save();
    })  
    socket.on('newmsg',async msg=>{
        var toUser = await  users.findOne({
            username:users.toUser
        })
        var fromUser = await users.findOne({
            username:msg.fromUser
        })
        msg.fromUserPic = fromUser.pic
        socket.to(toUser.currentSocket).emit('msg',msg)
        console.log(toUser)
    })
    socket.on('disconnect',async()=>{
        var disconnectedUser = await users.findOne({
            currentSocket:socket.id
        })
        disconnectedUser.currentSocket = ''
        await disconnectedUser.save();
    })
});
// end of socket.io logic
        
module.exports = socketapi;
