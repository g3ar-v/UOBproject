const checkAuth = require('./checkAuth')

//get token from request
module.exports = async (req, res, next) => {
  let decodedAndVerified = null;
  try {
    var auth = req.headers.authorization;//get the auth header from the incoming request

    let idToken = auth.substring(7);
    let result = await checkAuth(idToken)

    if (!result) {
      throw Error("Invalid token.")
    }
    req.userData = result

    next();
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      message: 'Auth failed'
    })
  }
}