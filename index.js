'use strict';
const express = require('express');
const res = require('express/lib/response');
const app = express()
const movieData = require("./data.json")
const port = 3000;

// routes
app.get("/test", handleHomePage);
app.get("/favoritePage" , handleFavoritePage);
app.get("/home" , handelMovie);
app.get("*", handleNotFound);


// functions
function handleFavoritePage(req , res)
{
  res.send("welcome to favorite page");
}
function handelMovie(req , res)
{
  let newMovie = new Movie(movieData.title , movieData.poster_path , movieData.overview);
  res.json(newMovie);
}


function handleHomePage(req , res)
{
  res.send(" testing ");
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

// //function handleRecipes(req , res)
// {
//     res.JSON(recipeData);
// }