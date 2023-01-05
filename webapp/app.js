// selectors
const apiKey = "&appid=d701daef71a4f53473964ce2534c886b";
const zipCodeField = document.getElementById("zip");
const feelingField = document.getElementById("feelings");
const submitButton = document.getElementById("generate");
const dateData = document.getElementById("date");
const tempData = document.getElementById("temp");
const contentData = document.getElementById("content");
const timeData = document.getElementById("time");
const formContainer = document.querySelector(".container");
const dataHolder = document.querySelector(".holder.entry");
const nameOfCityData = document.getElementById("name-city");
const date = new Date();
const dateToday = `${date.getDate()}/${
  date.getMonth() + 1
}/${date.getFullYear()}`;
let nameOfCity = "";

// getting time in 12 Hours format
const getTime = (date) => {
  let hours = date.getHours();
  let amORpm = hours >= 12 ? "PM" : "AM";
  // make the hours appear in 12hours format not 24hours format
  hours = hours % 12;
  // if 0 make it 12
  hours = hours ? hours : "12";
  return `${hours} ${amORpm}`;
};

// get the latitude and longitude from the api by zip entered by the user
const latAndLonRequest = async (zipCode, Key) => {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}${Key}`
  );
  // check if the user enter a zip code that is in the api
  if (response.status === 200) {
    try {
      const retrievedData = await response.json();
      return retrievedData;
    } catch (e) {
      console.log(
        "Something went wrong from getting latitude and longitude".toUpperCase(),
        e
      );
    }
  } else {
    alert("Sorry this country is not available try another one");
    location.reload();
  }
};

// get the weather data of the city
const weatherApiRequest = async (latitude, longtude, key) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtude}${key}&units=metric`
    );
    const retrievedData = await response.json();
    console.log(retrievedData);
    return retrievedData;
  } catch (e) {
    console.log(
      "Something went wrong from getting weather data".toUpperCase(),
      e
    );
  }
};
// post the data that come from the api and save them on the server
const postApiData = async (url = "", data = {}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const newData = await response.json();
    return newData;
  } catch (e) {
    console.log(
      "Something went wrong from posting weather data".toUpperCase(),
      e
    );
  }
};

// get the data from the server and update the UI with these data
const updateUI = async (url) => {
  try {
    const response = await fetch(url);
    const dataFromServer = await response.json();
    formContainer.classList.add("d-none");
    dataHolder.classList.remove("d-none");
    dateData.innerHTML = `<span class='sub-title'>Date:</span> ${dataFromServer.Date}`;
    tempData.innerHTML = `<span class='sub-title'>Temperature:</span> ${dataFromServer.Temperature}`;
    contentData.innerHTML = `<span class='sub-title'>Feel:</span> ${dataFromServer.UserFeeling}`;
    timeData.innerHTML = `<span class='sub-title'>Time:</span> ${dataFromServer.Time}`;
    nameOfCityData.innerHTML = `<span class='sub-title'>Name of City:</span> ${dataFromServer.NameOfCity}`;
  } catch (e) {
    console.log(
      "Something went wrong getting data from server".toUpperCase(),
      e
    );
  }
};

submitButton.addEventListener("click", (e) => {
  // when clicked check if the input fields are not empty
  if (
    zipCodeField.value &&
    feelingField.value &&
    dataHolder.classList.contains("d-none")
  ) {
    latAndLonRequest(zipCodeField.value, apiKey)
      .then((data) => {
        nameOfCity = data.name;
        return weatherApiRequest(data.lat, data.lon, apiKey);
      })
      .then((data) =>
        postApiData("/postData", {
          date: dateToday,
          temp: data.main.temp,
          userFeeling: feelingField.value,
          time: getTime(date),
          nameCity: nameOfCity,
        }).then(updateUI("/projectData"))
      );
  }
});
