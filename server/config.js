const md5 = require('md5');
const { readFile, writeFile } = require('fs').promises;
const dictionary = require('./dictionary');
const fs = require('./fs');

const { usersPath } = dictionary;
const { addUser, updateUserName, addNewProperties, removeUser } = fs;

const startProcess = () => {
  return {
    status: 'ok',
    message: "You've decided to give our API a try.",
    description:
      'For authorization you need to send a request to create a user containing login and password in JSON-format.',
    guide: {
      method: 'POST',
      url: '/api/v1/learn/api/auth',
      body: { login: '<your-login>', password: '<your-password>' },
    },
  };
};

const auth = async (login, password) => {
  const result = await readFile(usersPath)
    .then((dataString) => JSON.parse(dataString))
    .then((users) => {
      const user = users.find((user) => user.login === login);

      if (user.hash === md5(`${login}:${password}`)) {
        return {
          status: 200,
          id: user.id,
          message: 'You are logged in and can continue working with the API.',
          description:
            'If you want to start the process again, create a new account with a new login. Or delete the current account using the DELETE method.',
          guide: {
            label: 'How to delete user',
            method: 'DELETE',
            url: '/api/v1/learn/api/<your-id>',
            header: {
              Authorization: 'Bearer <md5(login:password)>',
            },
          },
        };
      }

      if (user) {
        return {
          status: 401,
          message: 'This user already exists.',
          description:
            'Change the name to start the process again, or enter the correct password to continue the previous process.',
        };
      }

      return addUser({ login, password, users });
    })
    .catch(() => addUser({ login, password }));

  return result;
};

const getUser = async (id) => {
  const result = await readFile(usersPath)
    .then((dataString) => JSON.parse(dataString))
    .then((users) => {
      const foundUser = users.find((user) => user.id === id);

      if (foundUser) {
        return {
          status: 200,
          userId: foundUser.id,
          message: 'Your profile details',
          data: {
            ...foundUser.data,
            login: foundUser.login,
          },
          description: "Let's change your name",
          guide: {
            method: 'PATCH',
            url: '/api/v1/learn/api/<your-id>',
            body: {
              name: '<new-name>',
            },
          },
        };
      }

      throw Error('No such user');
    })
    .catch((err) => {
      return {
        status: 404,
        message: err.message,
      };
    });

  return result;
};

const updateUser = async (id, name) => {
  const result = await readFile(usersPath)
    .then((dataString) => JSON.parse(dataString))
    .then((users) => {
      const foundUser = users.find((user) => user.id === id);

      if (foundUser) {
        return updateUserName({
          id: foundUser.id,
          name,
          users,
        });
      }

      throw new Error('No such user');
    })
    .catch((err) => {
      return {
        status: 404,
        message: err.message,
      };
    });

  return result;
};

const addProperties = async (id, body) => {
  const result = await readFile(usersPath)
    .then((dataString) => JSON.parse(dataString))
    .then((users) => {
      const foundUser = users.find((user) => user.id === id);

      if (foundUser) {
        return addNewProperties({
          id: foundUser.id,
          body,
          users,
        });
      }

      throw Error('No such user');
    })
    .catch((err) => {
      return {
        status: 404,
        message: err.message,
      };
    });

  return result;
};

const deleteUser = async (id, token) => {
  const result = await readFile(usersPath)
    .then((dataString) => JSON.parse(dataString))
    .then((users) => {
      const foundUser = users.find((user) => user.id === id);
      const isUser = foundUser.hash === token.split(' ')[1];

      if (foundUser && isUser) {
        return removeUser({ id: foundUser.id, users });
      }

      throw Error('Incorrect token');
    })
    .catch((err) => {
      return {
        status: 401,
        message: err.message,
      };
    });

  return result;
};

module.exports = {
  startProcess,
  auth,
  getUser,
  updateUser,
  addProperties,
  deleteUser,
};
