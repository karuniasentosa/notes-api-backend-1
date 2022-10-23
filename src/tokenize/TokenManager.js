const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artrifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artrifacts, process.env.REFRESH_TOKEN_KEY);

      const { payload } = artrifacts.decoded;

      return payload;
    } catch (err) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },

};

module.exports = TokenManager;
