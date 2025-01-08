// Gabriel Kiveu
// gabek964@iastate.edu
// Sep 25, 2024


function fetchData() {
  console.log("Begin Fetch");
  fetch('./person.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      appendData(data);
     
    })
    .catch(function (error) {
      console.log("error:" + error);
    });
}
fetchData();


function myfetchData1() {
  fetch('./person1.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      appendData(data);
     
    })
    .catch(function (error) {
      console.log("error:" + error);
    });
}

myfetchData1();

function myfetchData2() {
fetch('./person2.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      appendData(data);
     
    })
    .catch(function (error) {
      console.log("error:" + error);
    });
  console.log("End fetch");
}
myfetchData2();

function appendData(data) {
  let mainContainer = document.getElementById("myData1");
  let div = document.createElement("div");
  div.innerHTML = `<br>
    <h1> Superhero : </h1>
    Firstname : ${data.firstName} <br>
    Lastname : ${data.lastName} <br>
    Job : ${data.job} <br>
    Roll : ${data.roll} <br>
    <img src=${data.logo} alt="superhero" width="100" />`;

    
  mainContainer.appendChild(div);
} // end of function appendData

