const express =require('express')
const app=express();
const port =4000
const jwt = require('jsonwebtoken');
app.use(express.json());

const users = [];

  const SECRET_KEY = '12345';
  
const authenticateToken=(req,res,next)=>{
const Auth=req.headers['authorization'];
const token= Auth && Auth.split(' ')[1];
if(!token)
    return res.send('token is not avalible');
else 
    jwt.verify(token,SECRET_KEY,(err, user)=>{
        if(err) return res.send('this token is invalid')
        
        req.user=user
        next();
    })

}
app.post('/signUp',(req,res)=>{
    const {username,password}=req.body;
    console.log(req.body);
    const exist= users.find(user=> user.username===username)
    
    if(exist){
        res.status(404).send('this user already exist')
    }
    else {
       const  user={username, password}
    //    console.log(user);
       users.push(user);
       res.send(users)
    }

})
//authenticateToken,
app.get('/users',authenticateToken,(req,res)=>{
    
    res.send(users)

})
app.post('/login',(req ,res)=>{
    const {username,password}=req.body;

    const notmatch=users.filter(user=>user.username==username )
    if(notmatch.length){
        const encritedToken=jwt.sign({username:username,password:password},SECRET_KEY)
        res.json(encritedToken);
    }
    else{
        res.status(400).send('user not found')


    }
})

app.delete('/delete/:username',authenticateToken,(req,res)=>{
  const username=req.params.username
  console.log(username);
  const reminderUsers=users.filter(user=>user.username!=username)
  users=[]
  users.push(reminderUsers);
  res.send('delete account');
})

app.listen(port,()=>{
    console.log('PORT IS RUNNING AT :',port)
})