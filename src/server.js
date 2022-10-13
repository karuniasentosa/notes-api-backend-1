// dotenv import and run config
require('dotenv').config();

const Hapi = require('@hapi/hapi');

// === notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

// === users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UserValidator = require('./validator/users');

const init = async () => {
  const notesService = new NotesService();
  const userService = new UsersService();

  const server = Hapi.server({
    port: process.env.SVPORT,
    host: process.env.SVHOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  await server.register({
    plugin: users,
    options: {
      service: userService,
      validator: UserValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
