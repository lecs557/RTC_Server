const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid')

const ROOMS = {}

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/admin', (req, res) => {
  console.log("admin")
  res.render('admin', {rooms: ROOMS})
})

app.get('/rooms/:roomid', (req, res) => {
  var roomId = req.params.roomid
  if(roomId!="script.js"){
    if(!ROOMS[roomId]){
      res.redirect('/')
      return
    }
    console.log("ROOM "+roomId)
    res.render('room', { room: ROOMS[roomId] })
  }
})

io.on('connection', socket => {
  socket.on('open-room', roomName => {
    let roomId = uuidv4()
    ROOMS[roomId] = {
      id: roomId,
      name: roomName,
      users: []
    }
    socket.emit('opened_room', ROOMS[roomId])
    console.log('Open Room '+ROOMS[roomId].name)
  })
  socket.on('close-room', roomId => {
    console.log('Close Room '+roomId)
    delete ROOMS[roomId]
    socket.broadcast.emit('close-room', roomId)
  })
  socket.on('toggle-mute', (roomId, userId) => {
    console.log('user '+userId+' muted')
  })
  socket.on('toggle-hide', (roomId, userId) => {
    console.log('user '+userId+' hidden')
  })
  socket.on('join-room', (roomId, user) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-join-room', user)
    socket.broadcast.emit('join_room', roomId, user)
    ROOMS[roomId].users.push(user)
    socket.on('ban-user', user => {
      socket.broadcast.emit('ban-user', user.id)  
      console.log('BAN: '+user.id)    
    }) 


    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-leave-room', user.id)
      socket.broadcast.emit('leave_room',roomId, user.id)
      if(ROOMS[roomId]){      
        const index = ROOMS[roomId].users.indexOf(user)
        if (index > -1) {
          ROOMS[roomId].users.splice(index, 1)
        }
      }
    })   
  })
})

server.listen(3000)
console.log("Server has startet")
