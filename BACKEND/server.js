const port = 2000
// file systems
const fs = require('fs')
const https = require('https')
const app = require('./index')

// declares the privatekey and certificate
const options = {
    key: fs.readFileSync('Keys/privatekey.pem'),
    cert: fs.readFileSync('Keys/certificate.pem')
}
const httpServer = https.createServer((req,res)=>{
    // specify request for URL
    const httpUrl = 'https://${req.headers.host}${req.url}'
    res.writeHead(301, {location: httpUrl})
    // close the response
    res.end()
})
// redirect
httpServer.listen(80, () => {
    console.log('Server started. Unsecure server. Redirecting...')
})
//passing app and options through the server
const server = https.createServer(options, app)

server.listen(port, ()=>{
    console.log('Server started on port ' + port)
})