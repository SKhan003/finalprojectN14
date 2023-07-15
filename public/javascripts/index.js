var myBtn = document.querySelector("#myBtn");

var searchNewUserBox = document.querySelector("#searchMainBox"); 

var closeSpan = document.querySelector(".close");

var searchNewUserForm = document.querySelector("#findUser") 

myBtn.addEventListener("click",function(){
  searchNewUserBox.style.display = 'initial'
  
})

closeSpan.onclick = function () {
  searchNewUserBox.style.display = "none";
}


var personalUserChat = document.querySelector(".personalchat");
var userRightChat = document.querySelector("#userChats");

var currentOppositeUser = '';

function addChat(username,image){
  personalUserChat.innerHTML +=`<div onclick="openChat('${username}','${image}')" class="personalchat">
  <div class="personalProfile">
    <img src="${image}" alt="">
  </div>
  <h3>${username}</h3>
</div>`
}


async function openChat(username,image){
  currentOppositeUser = username
  userRightChat.innerHTML = `<div class="rightNav">
  <div class="rightUser">
    <img src=${image} alt="">
    <h2>${username}</h2>
  </div>
  </div>
  <div class="conversation">
    
  </div>
   <input type="text" onchange="newmsg()" id="newmsg" placeholder="start new conversation" />
  `
}

searchNewUserBox.addEventListener('submit',async (event)=>{
  event.preventDefault();
  var userDetail = document.querySelector(".newUsersearch");
  var responce = await axios.post('/findUser',{
    data:userDetail.value
  })
  if(responce.data.isUserThere){
    addChat(responce.data.user.username, responce.data.user.pic)
  }
  else{
    alert('no user found');
  }
})