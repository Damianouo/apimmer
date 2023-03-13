const jwt = require('jsonwebtoken');

//'Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json('Token is not valid!');

      //'"user" is decoded JWT content
      req.user = user; //?cteate a new prop in {req}
      next(); //?leave this function and go to router
    });
  } else {
    return res.status(401).json('You are not authenticated!');
  }
};

//' For User(Update)
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next(); //? two IDs eqal || Admin, then you can continue route function
    } else {
      res.status(403).json('You are not alowed to do that!');
    }
  });
};

//'For Admin(CRUD product etc.)
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('You are not alowed to do that!');
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
