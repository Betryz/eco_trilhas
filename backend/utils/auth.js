const jwt = require('jsonwebtoken');
const zlib = require('zlib');

function generateShortAccessToken(data) {
  const payload = { clientId: data.clientId, orderId: data.orderId };
  const compressedPayload = zlib.deflateSync(JSON.stringify(payload)).toString('base64');
  const token = jwt.sign({ data: compressedPayload }, process.env.SECRET_KEY, { algorithm: 'HS256' });
  
  // Retorna apenas os primeiros 10 caracteres do token
  return token.substring(0, 10);
}

function generateAccessToken(data, options = { expiresIn: '1800s' }) {
  return jwt.sign(data, process.env.SECRET_KEY, options);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
    if (err) {
      console.log('Erro de autenticação JWT:', err.message);
      return res.sendStatus(403);
    }

    req.accessToken = data;
    next();
  });
}

module.exports = { generateShortAccessToken, generateAccessToken, authenticateToken };
