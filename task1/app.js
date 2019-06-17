const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'method_crud',
  multipleStatements: true
});
con.connect((error) => {
  if(!error)
    console.log("DB connected");
  else
    console.log("Problem with DB");  
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json("To use api you need follow this link: @/users");
});

app.get('/users', (req, res) => {
  con.query("SELECT * FROM `users` WHERE deleted != '1' ", (err, rows, fields) => {
    if(!err) res.send(rows);
    else console.log(err);
  })
});

app.get('/users/:id', (req, res) => {
  con.query('SELECT * FROM `users` WHERE id = ?', [req.params.id], (err, rows, fields) => {
    if(!err) res.send(rows);
    else console.log(err);
  })
});

app.delete('/users/:id', (req, res) => {
  con.query("UPDATE `users` SET `deleted`='1' WHERE `id` = ?", [req.params.id], (err, rows, fields) => {
    if(!err) res.send('Deleted');
    else console.log(err);
  })
});

app.post('/users', function (req, res) {
   var postData  = req.body;
   con.query('INSERT INTO `users` SET ?', postData, function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

app.put('/users', function (req, res) {
  con.query('UPDATE `users` SET `username`=? where `id`=?', [req.body.username, req.body.id], function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
});

app.listen(3000, () => {
  console.log("port: @::3000");
});