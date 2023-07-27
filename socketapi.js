const io = require( "socket.io" )();
const users = require('./routes/users.js')
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log( "A user connected" );
    socket.on('newUserConnect',(msg)=>{
        console.log(msg);
    })  
});
// end of socket.io logic

module.exports = socketapi;
