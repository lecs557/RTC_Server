const socket = io('/')
const ALL_ROOMDIVS = document.getElementById('rooms')
const tf_room = document.getElementById("open_new_room")
const USERDIVS_OF_ROOM = {}

// listener
socket.on('join_room', (roomId, user) => {
  console.log('user joined room')
  if(!ROOMS[roomId]){
    ROOMS[roomId] = {}
  }
  ROOMS[roomId].users.push(user)
  add_user(user, roomId)
})

socket.on('leave_room', (roomId, userId) => {
  console.log('user leaved room')
    remove_user(userId, roomId)
})

socket.on('opened_room', room => {
  console.log('Open: '+room.id)
  ROOMS[room.id] = room
  add_room(room)
  tf_room.value=''
})

function open_new_room(){
  var new_room = tf_room.value
  socket.emit('open-room', new_room)
}

function go_to_room(){
  window.open('/rooms/'+ document.getElementById('sel_rooms').value)
}

function close_room(){
  let roomId = document.getElementById('sel_rooms').value
  remove_room(roomId)
  socket.emit('close-room', roomId)
}

function render_rooms(){
  for(var roomId in ROOMS){ 
    add_room(ROOMS[roomId])    
    for(var i in ROOMS[roomId].users){
      add_user(ROOMS[roomId].users[i], roomId )
    }
  } 
}

function add_room(room){
  var div_room = document.createElement("div")
  div_room.className = 'div_room'
  var div_roomName = document.createElement("div")
  div_roomName.className = 'room_name'
  div_roomName.innerHTML = room.name
  var div_roomId = document.createElement("div")
  div_roomId.className = 'room_id'
  div_roomId.innerHTML = room.id
  var div_userIds = document.createElement("div")
  div_userIds.className = 'div_users'
  div_room.append(div_roomName)
  div_room.append(div_roomId)
  div_room.append(div_userIds)    
  ALL_ROOMDIVS.append(div_room)
  USERDIVS_OF_ROOM[room.id]=div_userIds
  let sel_rooms = document.getElementById('sel_rooms')
  let option = document.createElement("option");
  option.text = room.id;
  sel_rooms.add(option); 
}

function add_user(user, roomId){
  var div_user = document.createElement("div")
  div_user.className = 'div_user'
  var div_userName = document.createElement("div")
  div_userName.className='user_name'
  div_userName.innerHTML = user.name
  var div_userId = document.createElement("div")
  div_userId.className='user_id'
  div_userId.innerHTML = user.id
  let btn_ban = document.createElement("button")
  btn_ban.innerHTML='Bannen'
  btn_ban.onclick=function(){socket.emit('ban-user', user.id)}
  div_user.append(div_userName)
  div_user.append(div_userId)
  div_user.append(btn_ban)
  USERDIVS_OF_ROOM[roomId].append(div_user)
}

function remove_user(userId, roomId){
  if(!USERDIVS_OF_ROOM[roomId] || USERDIVS_OF_ROOM[roomId].children.length==0){
    console.log('no user in room not found')
    return
  }
  for(i in USERDIVS_OF_ROOM[roomId].children){
    if(USERDIVS_OF_ROOM[roomId].children[i].children[1].innerHTML == userId){
      USERDIVS_OF_ROOM[roomId].children[i].remove()
      break
    }
  }
}

function remove_room(roomId){
  for(i in ALL_ROOMDIVS.children){
    if(i==0){
      continue
    }
    if(ALL_ROOMDIVS.children[i].children[1].innerText == roomId){
      ALL_ROOMDIVS.children[i].remove()
      delete USERDIVS_OF_ROOM[roomId]
      break
    }
  }
  let sel_rooms = document.getElementById('sel_rooms')
  for(i in sel_rooms.children){
    if(sel_rooms.children[i].innerText == roomId){
      sel_rooms.children[i].remove()
      break
    }
  }
}

render_rooms()