// Variables
const socket = io('/')
const videoGrid = document.getElementById('video-grid')

let EGO
let myStream
let users = {}
const myVideo = document.createElement('video')
myVideo.muted=true


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
  const video = document.createElement('video')
  console.log("User has connected - call")
  console.log(call)
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, user.id)
  })
  user.call = call
  user.video = video
  users[user.id] = user
  console.log(user)
})

function call(user){
  myPeer.call(users.id, myStream, {metadata: EGO})
  console.log(user)
}

myPeer.on('call', call => {
  console.log("caal")
  const user = call.metadata
  console.log("You get a call from "+ user)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, user)
  })
  user.call = call
  user.video = video
  users[user.id] = user
  call.answer(myVideo.srcObject)
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
  if(room == ROOM_ID){
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
  socket.emit('toggle-mute', ROOM_ID, EGO.id)
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
  socket.emit('toggle-hide', ROOM_ID, EGO.id)
}

//Code
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myStream = stream
  addVideoStream(myVideo, stream, EGO.id)
  socket.emit('join-room', ROOM_ID, EGO)
})

function addVideoStream(video, stream, user) {
  console.log("add video")
  if(stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }
}

