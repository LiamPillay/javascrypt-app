const jst = require ('jsonwebtoken')

module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        jst.verify(token, 'UsingJSONtoGenerateaSessionToken')
        next()
    }
    catch(error){
        res.status(403).json({
            message: 'invalid token'
        })
    
    }
}
