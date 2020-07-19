var express = require("express");
var fs = require('fs');
var path = require('path');
const { v4: uuidv4 } = require('uuid');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));



app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", function (err, data) {
    if (err) throw err;
    console.log(JSON.parse(data));
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", function (req, res) {
  const newNote = req.body;
  newNote.id = uuidv4();
  // Grab it from db.json and parse it into an array
  const notes = JSON.parse(fs.readFileSync(__dirname + "/db/db.json", function (err, data) {
    return data;
  }));

  console.log(notes);

  // Push your new note (aka req.body) into that parsed array
  notes.push(newNote);
  res.json(notes);

  // Then rewrite to db.json and overwrite whatever is in there
  fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(notes), function (err, data) {
    if (err) throw err;
    console.log("Done!")
  });

});

app.delete("/api/notes/:id", function(req, res){
  const noteId = req.params.id;
  let notes = JSON.parse(fs.readFileSync(__dirname + "/db/db.json", function (err, data) {
    return data;
  }));
  // removing selected note from the list using filter function
  notes = notes.filter(function(note){
    if(note.id === noteId){
      return false;
    }
    return true;
    

  });
  res.json(notes);

  fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(notes), function (err, data) {
    if (err) throw err;
    console.log("Deleted!")
  });

});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
