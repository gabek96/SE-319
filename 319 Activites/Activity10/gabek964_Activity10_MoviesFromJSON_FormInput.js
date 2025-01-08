function fetchMovies() {
    const b = document.getElementById("my_form");
    b.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent the form from submitting in the traditional way
      fetch("./MoviesFromJSON.json");
    });
  }
  
  function loadMovies(myMovies){
    const m = document.getElementById("selectedMovie");
    const inputMovieName = m.value;

    var CardMovie = document.getElementById("col");

    // Clear previous movie data
    CardMovie.innerHTML = ""; // This will clear the previous movie data and image

    for (let i = 0; i <myMovies.movies.length; i++) {
      if (movies.title === inputMovieName) {
        let title = movies[i].title;
        let year = movies[i].year;
        let url = movies[i].url;
        console.log(title);

        // construct the HTML element
        let AddCardMovie = document.createElement("div");
        AddCardMovie.classList.add("col"); // Add Bootstrap class to the column
        AddCardMovie.innerHTML = `<div class="card shadow-sm"> <img src=${url} class="card-img-top" alt="..."></img> <div class="card-body"><p class="card-text"> <strong>${title}</strong>, ${year}</p></div></div>`;
        CardMovie.appendChild(AddCardMovie);
      } // end of if  
    } // end of for
   

  }