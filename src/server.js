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

// === authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const init = async () => {
  const notesService = new NotesService();
  const userService = new UsersService();
  const authenticationService = new AuthenticationsService();

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

  await server.register({
    plugin: authentications,
    options: {
      authenticationsService: authenticationService,
      usersService: userService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
