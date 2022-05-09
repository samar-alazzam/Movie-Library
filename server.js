'use strict';
const url="postgres://samar:1234@localhost:5432/demo1";
const express = require('express');
const res = require('express/lib/response');
const app = express();
const axios=require('axios').default;
const movieData = require("./data.json");
const bodyParser = require('body-parser');
const { Client } = require('pg');
const { query } = require('express');
const client = new Client(url);
const port = 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());





// routes
app.get("/", handleHomePage);
app.get("/favoritePage" , handleFavoritePage);
app.get("/trending" , handleTrending);
app.get("/search" , handleSearch);
app.post("/addMovie", handleAdd);
app.get("/getMovies", handleGet );
app.put("/UPDATE" , handleUpdate);
app.delete("/deleteMovie" , handleDelete);
app.get("/getMOVIE" , handleGetMovie);
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

function handleAdd(req , res){
  console.log(req.body);
  //res.send("adding to database in progress");
  const {id, title, overview , poster_path} = req.body;
  let sql = 'INSERT INTO movie (id , title, overview , poster_path) VALUES ($1 , $2 , $3 , $4) RETURNING * ;'
  let values =[ id ,title, overview , poster_path];

  client.query(sql , values).then((result)=>{
    console.log(result);
     res.json(result.rows[0]);
  })

.catch();

}

function handleGet(req , res){
  let sql='SELECT * FROM movie ; '
  client.query(sql).then((result)=>{
    console.log(result);
    res.json(result.rows);

  }).catch();

}


function handleUpdate(req , res) {
  const Id = req.query.Id;
  const {id , title , overview , poster_path}= req.body;
  let sql = 'UPDATE movie SET id=$1 , title=$2 , overview=$3 , poster_path=$4 WHERE id=$5 RETURNING * ;'
  let values = [id , title , overview , poster_path , Id];
  client.query(sql , values).then(result =>{
    console.log(result);
    //res.send("working");
    res.json(result.rows[0]);

  }).catch();
}

function handleDelete(req , res){
  const {Id} = req.query;
  console.log(Id);
  let sql = 'DELETE FROM movie WHERE id=$1 ;'
  let value=[Id];
  client.query(sql , value).then(result =>{
    console.log(result);
    res.send("deleted");
  })
}

function handleGetMovie(req , res){
  let sql = 'SELECT * FROM movie;'
  client.query(sql).then(result =>{
    console.log(result);
    res.json(result.rows);

  }).catch();
    
}





client.connect().then(()=>{
  app.listen(port ,()=>{
      console.log(`server is listening ${port}`);

  });


});







function handleNotFound(req , res) 
{
  res.status(404).send("Not Found");
}


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



