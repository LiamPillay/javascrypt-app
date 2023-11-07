const express = require('express')
const mongoose = require('mongoose')
const app = express()
const User = require('./Models/users')
const bcrypt = require('bcrypt')
const connstring = 'mongodb+srv://ynpsellers:o3gvCz7rYHhQeSVH@cluster0.jxmwcxl.mongodb.net/'
const jst = require ('jsonwebtoken')
const cors = require('cors')
const isAuthenticated = require('./Models/auth')

mongoose.connect(connstring, {
    useNewUrlParser: true, 
    useUnifiedTopology: true})
.then(()=>{
    console.log('Connection established successfully.')
})
.catch(error => {
    console.error('Connection failed')
})

const corsOpt = {
    origin: 'http://localhost:4200',
    optionSuccessStatus: 200 
}
app.use(cors(corsOpt))
app.use(express.json()) //middleware
app.use(cors())
app.use((reg,res,next)=>
{
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,ContentType,Accept,Authorization');
 res.setHeader('Access-Control-Allow-Methods', '*');
 next();
});
// expressbrute methods and implementation
const ExpressBrute = require('express-brute')
const stateMemory = new ExpressBrute.MemoryStore()
const bruteforce = new ExpressBrute(stateMemory, {
    freeRetries: 5,
    minWait: 2*60*1000,
    maxWait: 60*60*1000,
    failCallback: function(req, res, next, nextValueRequestDate){
        res.status(429).send("Many attempts detected. Please wait!")
    }
})
const Task = require('./Models/model')

// creating user account with hash password
const saltRounds = 10
app.post('/register', (req, res) =>{
    console.log(req.body.password,saltRounds)
    bcrypt.hash(req.body.password,saltRounds)
    .then(hash => {
        const user = new User({
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            password: hash,
            email: req.body.email
        })
        user.save()  
        .then(result =>{ //Then, if it managed to save
            res.status(201).json({message: 'User saved successfully', result: result }) //avoid displaying username and password
        })       
        .catch(error =>{
            res.status(500).json({error: 'Failed to save user'})
        })
    })
    .catch(err => {
        console.log(err) //user will not see this
        res.status(500).json({error: 'Hashing failed'})
    })
})

// logon feature with bcrypt.compare and bruteforce
app.post('/login', bruteforce.prevent, (req, res) => {
    const{ username, password } = req.body
    User.findOne({username})
    .then(user => {
        if(!user){ // ! = not found
            return res.status(401).json({error: 'Authentication failed'})
        }
        bcrypt.compare(password, user.password)
        .then(match => {
            if(match){
                const token = jst.sign({username: user.username, userid: user._id},
                    'UsingJSONtoGenerateaSessionToken', {expiresIn: '1h'})               
                res.status(201).json({username, message:'Logged in successfully', token: token})
            }
            else{
                res.status(403).json({error: 'Authentication failed'})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: 'Failed to login, please check password or username'})
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: 'User does not exist!'})
    })
})

// add data to the database
//app.post('/tasks',(cors(corsOpt)),isAuthenticated,async (req, res) =>{
    app.post('/tasks',async (req, res) =>{
    const newTaskData = req.body
   try{
        const newTask = await Task.create(newTaskData)
        res.status(201).json(newTask)
    }
    catch(error) {
        res.status(500).json({error: 'an error has occured'})
    }
})

// retrieves data from the database
//app.get('/tasks',(cors(corsOpt)),isAuthenticated, (req, res) =>{
    app.get('/tasks', (req, res) =>{
    Task.find()
    .then((newTask) =>{
        res.json({
            message: 'Task found',
            newTask: newTask
        })
    })
})

// delete from the database using ID
    app.delete('/tasks/:_id', (req, res)=>{
    //app.delete('/tasks/:_id',(cors(corsOpt)), (req, res)=>{
    Task.deleteOne({_id: req.params.id})
    .then((result) =>{
        res.status(201).json({message: 'Task deleted', result: result})
    })
})

//app.delete('/tasks/:id', cors(corsOpt), (req,res) =>{
  //  Task.deleteOne({_id: req.params.id})
    //.then((result) =>{
      //  res.status(201).json({message: 'Task deleted', result: result})
    //})
//})

module.exports = app;
//const port = 2000

//const server = https.createServer( app)

//server.listen(port, ()=>{
 //   console.log('Server started on port ' + port)
//})