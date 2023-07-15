const io = require( "socket.io" )();
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log( "A user connected" );
    socket.on('newUserConnected',async msg=>{
        var currentUser = await User.findOne({
            username:msg.user
        })
        currentUser.currentSocket = socket.id
        await currentUser.save();
    })
});
// end of socket.io logic

module.exports = socketapi;
