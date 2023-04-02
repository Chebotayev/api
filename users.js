const bcrypt = require('bcrypt');

const users = [];

const createUser = async (username, password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = { id: users.length + 1, username, password: hashedPassword };
  users.push(user);
  return user;
};

const getUserByUsername = (username) => {
  return users.find((user) => user.username === username);
};

module.exports = { createUser, getUserByUsername, users };
