const checkRoles = require('./checkRoles');

module.exports = (req, res, next, permission, data) => {
  let roles = [];
  let userData = req.userData

  try {
    if (!userData || !userData.roles) {
      throw Error("no userData or roles");
    }
    if (!checkRoles(userData.roles, permission, data)) {
      throw Error("role check failed")
    }
    req.userData = userData;
    next();
  }
  catch (err) {
    console.log(err)
    res.status(401).json({
      message: 'Auth failed'
    })
  }
}