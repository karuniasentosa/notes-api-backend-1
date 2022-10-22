// dotenv import and run config
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

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
    plugin: Jwt,
  });

  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artrifacts) => ({
      isValid: true,
      credentials: {
        id: artrifacts.decoded.payload.id,
      },
    }),
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
