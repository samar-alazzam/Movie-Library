'use strict';
const express = require('express');
const res = require('express/lib/response');
const app = express()
const movieData = require("./data.json")
const port = 3000;

// routes
app.get("/", handleHomePage);
app.get("/favoritePage" , handleFavoritePage);
app.get("*", handleNotFound);


// functions
function handleFavoritePage(req , res)
{
  res.send("welcome to favorite page");
}
function handleHomePage(req , res)
{
  let newMovie = new Movie(movieData.title , movieData.poster_path , movieData.overview);
  res.json(newMovie);
}




function handleNotFound(req , res) 
{
  res.status(404).send("Not Found");
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function Movie (title , poster_path , overview)
{
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}


