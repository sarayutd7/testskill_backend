let express = require('express');
let app = express();
let bcrypt = require('bcrypt');
let bodyParser = require('body-parser');
let dbConnection = require('./database'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 
// homepage route
app.get('/', (req, res) => {
    return res.send({ 
        error: false, 
        message: 'cPanel to RESTful CRUD API with NodeJS, Express, MYSQL',
        written_by: 'Sarayut D',
        published_on: ''
    })
})

 
// retrieve all User
app.get('/allUser', (req, res) => {
    dbConnection.query('SELECT * FROM users', (error, results, fields) => {
        if (error) throw error;

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "User table is empty";
        } else {
            message = "Successfully retrieved all User";
        }
        return res.send({ error: false, data: results, message: message});
    })
})

//add User 
app.post('/addUser', (req, res) => {
    let name = req.body.name;
    let lastname = req.body.lastname;
    let username = req.body.username;
    let password = req.body.password;  
    // validation
    if (!name || !lastname || !username || !hash_pass) {
        return res.status(400).send({ error: true, message: "Please enter Name and Lastname, Username Or Password."});
    } else {
        bcrypt.hash(password, 12).then((hash_pass)=>{
        dbConnection.query('INSERT INTO users (name, lastname,username, password) VALUES(?, ?, ?)', [name, lastname, username, hash_pass], (error, results, fields) => {
            if (error) throw error;
            return res.send({ error: false, data: results, message: "User detail successfully added"})
        })
        .then(result => {
            res.send(`your account has been created Successfully, Now you can <a href="/">Login</a>`);
        }).catch(err => {
           // THROW INSERTING USER ERROR'S
                if (err) throw err;
        });
    })
    .catch(err => {
        // THROW HASING ERROR'S
        if (err) throw err;
    })

        
    }
});


//
// retrieve book by id 
app.get('/users/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide User id"});
    } else {
        dbConnection.query("SELECT * FROM users WHERE id = ?", id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "User not found";
            } else {
                message = "Successfully User data";
            }

            return res.send({ error: false, data: results[0], message: message })
        })
    }
})


app.listen(3232, () => {
    console.log('Node App is running on port 3232');
})

module.exports = app;