const express = require("express");
const app = express();
const port = 3000;

// API endpoint
let projectData = {};

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

//link the server with the folder of the project
app.use(express.static("webapp"));

// get request to give all the data that are saved in the endpoint
app.get("/projectData", (request, response) => {
  response.send(projectData);
});

// post request to post the data came from the external api into the server endpoint
app.post("/postData", (request, response) => {
  projectData["Date"] = request.body.date;
  projectData["UserFeeling"] = request.body.userFeeling;
  // changing the temperature from kelvin to degree celcius
  projectData["Temperature"] = `${Math.floor(request.body.temp)} \u00b0C`;
  projectData["Time"] = request.body.time;
  projectData["NameOfCity"] = request.body.nameCity;
  console.log(projectData);
});

app.listen(port, () => {
  console.log("Server is active");
});
