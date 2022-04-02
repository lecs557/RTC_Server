// Variables
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const room_name = document.getElementById('room-name')
room_name.innerHTML = ROOM.name

let EGO
let myStream
let users = {}
let myVideo 

const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

//Listener
myPeer.on('open', id => {
  console.log("You join the room")
  EGO = {
    id: id,
    name:'test',
    mute: false,
    hide: false
  }
})

socket.on('user-join-room', user => {
  const call = myPeer.call(user.id, myStream, {metadata: EGO})
  console.log("User has connected - call")
  let video
  call.on('stream', userVideoStream => {
    video = new Video(user, userVideoStream).getDomElement()
    if(!users[user.id]){
      videoGrid.append(video)
      console.log("append")
      user.video = video
      users[user.id] = user
    }
  })
  user.call = call
})

myPeer.on('call', call => {
  const user = call.metadata
  let video
  console.log("You get a call from "+ user.name)
  call.on('stream', userVideoStream => {
    video = new Video(user, userVideoStream).getDomElement()
    if(!users[user.id]){
      videoGrid.append(video)
      console.log("append get")
      user.video = video
      users[user.id] = user
    }
  })
  user.call = call
  call.answer(myStream)
})

socket.on('toggle-mute', (roomId, userId) => {
  if(userId == EGO.id){

  }
})

socket.on('toggle-hide', (roomId, userId) => {
  if(userId == EGO.id){
    
  }
})

socket.on('ban-user', userId => {
  if(userId == EGO.id){
    window.location='/a'
  }
})

socket.on('user-leave-room', userId => {
  console.log('User leaves')
  if (users[userId]){
    users[userId].call.close()
    users[userId].video.remove()
    delete users[userId]
  }
})

socket.on('close-room', room => {
  if(room == ROOM.id){
    window.location='/a'
  }
})


function mute(){
  const track = myStream.getTracks().find(track => track.kind === "audio")
  if(track.enabled){
    track.enabled=false
    EGO.muted = true
  } else{
    track.enabled=true
    EGO.muted = false
  }
  socket.emit('toggle-mute', ROOM.id, EGO.id)
}

function hide(){
  const track = myStream.getTracks().find(track => track.kind === "video")
  if(track.enabled){
    track.enabled=false
    EGO.hide = true
  } else{
    track.enabled = true
    EGO.hide = false
  }
  socket.emit('toggle-hide', ROOM.id, EGO.id)
}

//Code
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myStream = stream
  myVideo = new Video(EGO, stream)
  myVideo.silent()
  videoGrid.append(myVideo.getDomElement())
  socket.emit('join-room', ROOM.id, EGO)
})

