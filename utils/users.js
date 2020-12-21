/*
* this chat is simple
* we do not need a DB connection
* we do not need a heavy ops
* we save time, space and speed
* */

//______________ DB ___________________
// Variable for collect users
const users = [];

//______________ HELPERS ___________________
// user join to chat
function userJoin(id, name, room) {
  const user = { id, name, room };
  users.push(user);
  return user;
}

// get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// user leave chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);
  if(index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// get list of room's users
function getRoomUsers(room) {
  return users.filter(user => user.room === room)
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};