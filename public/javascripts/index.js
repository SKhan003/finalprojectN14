var myBtn = document.querySelector("#myBtn");

var searchNewUserBox = document.querySelector("#searchMainBox");

var closeSpan = document.querySelector(".close");

var searchNewUserForm = document.querySelector("#findUser");

myBtn.addEventListener("click", function () {
  searchNewUserBox.style.display = "initial";
});

closeSpan.onclick = function () {
  searchNewUserBox.style.display = "none";
};

var allChat = document.querySelector("#allChat");
var userRightChat = document.querySelector("#userChats");

var currentOppositeUser = "";

function addChat(username, image) {
  allChat.innerHTML += `<div id="personalchat" onclick="openChat(${username},${image})" class="personalchat">
        <div class="personalProfile">
            <img src="${image}" alt="">
          </div>
              <h3>${username}</h3>
          </div>`;
}

function openChat(username,image) {
  userRightChat.innerHTML = ` <div id="rightUserNav">
  <div class="rightUserImage"><img src="${image}" alt=""></div>
  <h2>${username}</h2>
</div>
<div id="usersConversation">
</div>
<div id="rightBottomInput">
  <div class="sme">
    <i class="ri-emotion-happy-line"></i>
  </div>
  <div class="sme">
    <i class="ri-attachment-2"></i>
  </div>
  <textarea placeholder="Type a message"></textarea>
  <div class="sendbtn sme">
    <i class="ri-send-plane-line"></i></a>
  </div>
</div>`;
}

searchNewUserBox.addEventListener("submit", async (event) => {
  event.preventDefault();
  var userDetail = document.querySelector("#newUsersearch").value;
  var responce = await axios.post("/findUser", {
    username:userDetail
  });
  var findUser = responce.data.user
  addChat(findUser.username,findUser.pic)
});
