'use strict';
const express = require('express');
const res = require('express/lib/response');
const app = express();
const axios=require('axios').default;
const movieData = require("./data.json")
const port = 3000;

// routes
app.get("/", handleHomePage);
app.get("/favoritePage" , handleFavoritePage);
app.get("/trending" , handleTrending);
app.get("/search" , handleSearch);
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
function handleTrending(req , res){
  const url="https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US";
  axios.get(url)
  .then((result)=>{
    console.log(result.data.results);
   // res.send("inside then");
    let trending= result.data.results.map((trend)=>{
      return new Trend(trend.ip , trend.title , trend.release_date , trend.poster_path , trend.overview);
    })
    res.json(trending);

  })
  .catch();
  
}
function handleSearch(req , res){
  let name = req.query.mName;
  const url=`https://api.themoviedb.org/3/search/movie?query=${name}&api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2`;
  axios.get(url)
  .then((result)=>{
    res.json(result.data.results);
  }
  ).catch();
}



function handleNotFound(req , res) 
{
  res.status(404).send("Not Found");
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

function Movie (title , poster_path , overview)
{
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

function Trend (id , title , release_date , poster_path ,overview)
{
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path=poster_path;
  this.overview=overview;
}



