const express = require("express");
const app = express();
const port = 4000;
const jwt = require("jsonwebtoken");
app.use(express.json());

let users = [];

const SECRET_KEY = "12345";


const authenticateToken = (req, res, next) => {
    const Auth = req.headers["authorization"];
    const token = Auth && Auth.split(" ")[1];
    console.log(token,'this is token');
    if (!token) return res.send("token is not avalible");
    else
        jwt.verify(token, SECRET_KEY, { expiresIn: '1m' }, (err, user) => {
            if (err) {
                return {message:"not authorized",statusCode:401,success:false}
            }
            req.user = user;
            next();
        });
};
app.post("/signUp", (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    const exist = users.find((user) => user.username === username);

    if (exist) {
        res.status(500).send("this user already exist");
    } else {
        const user = { username, password };
        //    console.log(user);
        users.push(user);
        res.status(200).send(user);
    }
});

app.get("/users", authenticateToken, (req, res) => {
    res.send(users);
});
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const notmatch = users.filter((user) => user.username == username);
    if (notmatch.length) {
        const encritedToken = jwt.sign({ username, password }, SECRET_KEY,);
        res.status(200).send(encritedToken);
    } else {
        res.status(400).send("user not found");
    }
});
app.put("/userupdate/:username", authenticateToken, (req, res) => {
    const usernameParam = req.params.username;
    const userfound = users.find((user) => user.username === usernameParam);
    if (userfound) {
        const { username, password } = req.body;
        userfound.username = username;
        userfound.password = password;
        res.status(200).send(userfound);
    }
    else res.send('user not found')
});

app.delete("/delete/:username", authenticateToken, (req, res) => {
    const username = req.params.username;
    console.log(username);
    const userFound= users.findIndex((user) => user.username === username);
    console.log('this index delte',userFound);
    if(userFound){
        users.splice(userFound ,1);
        res.send("delete account");
    }
    else{
        res.status(503).send('not account is deleted ')
    }
    
    
});

app.listen(port, () => {
    console.log("PORT IS RUNNING AT :", port);
});