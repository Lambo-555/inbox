// importing libraries and custom modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const config = require('./config/config');
const msg = require('./utils/messages');
const {userJoin, getCurrentUser, getRoomUsers, userLeave} = require('./utils/users');

// app initiation
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {cors: {origin: "*"}});

// socket IO initiation
const botName = 'bot';
io.on('connection', socket => {

  // user join to chat room
  socket.on('joinRoom', ({name, room}) => {
    const user = userJoin(socket.id, name, room);
    if (user) {
      try {
        socket.join(user.room);
      } catch (e) {
        console.log(e.message ? e.message : e);
      }
    } else {
      console.log(`joinRoom error. Can't add user:${name} to room:${room}`);
    }

    // Say hello to new user
    try {
      socket.emit('message', msg(botName, 'welcome', socket.id));
    } catch (e) {
      console.log(e.message ? e.message : e);
    }

    // broadcast about new chat user
    try {
      socket.broadcast
          .to(user.room)
          .emit('message', msg(botName, `user ${user.name} join`));
    } catch (e) {
      console.log(e.message ? e.message : e);
    }

    // Sending list of connected users
    try {
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    } catch (e) {
      console.log(e.message ? e.message : e);
    }
  });

  // Listen for new messages
  socket.on('chatMessage', data => {
    const curUser = getCurrentUser(socket.id);
    if (curUser) {
      try {
        io.to(curUser.room)
            .emit('message',
                msg(curUser.name, data.message, socket.id, false));
      } catch (e) {
        console.log(e.message ? e.message : e);
      }
    } else {
      console.log(`chatMessage error. user(id:${socket.id}) not found`);
    }
  });

  // User disconnected
  socket.on('disconnect', () => {
    const user = userLeave((socket.id));
    if (user) {
      try {
        io.to(user.room).emit(
            'message', msg(botName, `${user.name} leave`
            ));
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        })
      } catch (e) {
        console.log(e.message ? e.message : e);
      }
    } else {
      console.log(`disconnect error. user(id:${socket.id}) not found`);
    }
  });

});

// server starting
server.listen(config.SERVER_PORT, () => console.log(`Server run on PORT: ${config.SERVER_PORT}`));