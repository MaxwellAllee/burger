var express = require("express");

var app = express();

var PORT = process.env.PORT || 8080;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection 
if (process.env.JAWSDB_URL){
    connection = mysql.createConnection(process.env.JAWSDB_URL)
}
else{    
connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "burgers_db"})
}
  

  
  connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
  
    console.log("connected as id " + connection.threadId);
  });
  app.use(express.static('public'))
  app.get("/", function(req, res) {
    connection.query("SELECT * FROM burgers", function(err, data) {
    var bur=[]
    var eBur=[]
      if (err) {
        return res.status(500).end();
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].devoured ===0){
          bur.push(data[i])
        }
        else{
            eBur.push(data[i])
        }
          
      }
      res.render("index", { burger: bur, dburgers: eBur });
    });
  });
  
  
  app.post("/", function(req, res) {
      console.log(req.body)
    connection.query("INSERT INTO burgers (burger_name) VALUES (?)",[req.body.burger_name, req.body.devoured], function(err, result) {
      if (err) {
        return res.status(500).end();
      }
    
      res.json({ id: result.insertId });
      console.log({ id: result.insertId });
    });
  });
  
  

  app.put("/:id", function(req, res) {

    connection.query("UPDATE burgers SET devoured = ? WHERE id = ?", [req.body, req.params.id], function(err, result) {
      if (err) {
        // If an error occurred, send a generic server failure
        return res.status(500).end();
      }
      else if (result.changedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();
  
    });
  });
  
  // Start our server so that it can begin listening to client requests.
  app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });

