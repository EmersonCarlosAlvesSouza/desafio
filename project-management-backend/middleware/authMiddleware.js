const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado, token ausente' });
    }

    try {
        const decoded = jwt.verify(token, 'secreta-chave-jwt');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token inválido' });
    }
};
