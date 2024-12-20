function fetchMovies() {
  return fetch("./MoviesFromJSON.json")
    .then((response) => response.json())
    .then((data) => data.movies)
    .catch((error) => console.log("Error fetching movies: " + error));
}

function displayMovies(movies) {
  const col = document.getElementById("col");
  col.innerHTML = ""; // Clear previous movie data

  movies.forEach((movie) => {
    const { title, year, url, price, description } = movie;

    const movieCard = document.createElement("div");
    movieCard.classList.add("col"); // Bootstrap column

    movieCard.innerHTML = `
      <div class="card shadow-sm">
        <img src="${url}" class="card-img-top" alt="${title}">
        <div class="card-body">
          <p class="card-text">
            <strong>${title}</strong> (${year})<br>
            $${price.toFixed(2)}<br>
            ${description}
          </p>
        </div>
      </div>
    `;
    col.appendChild(movieCard);
  });
}

function showCardsSortedByPriceLowHigh() {
  fetchMovies().then((movies) => {
    const sortedMovies = movies.sort((a, b) => a.price - b.price);
    displayMovies(sortedMovies);
  });
}

function showCardsSortedByPriceHighLow() {
  fetchMovies().then((movies) => {
    const sortedMovies = movies.sort((a, b) => b.price - a.price);
    displayMovies(sortedMovies);
  });
}

function showCardsContainingDescriptionA() {
  fetchMovies().then((movies) => {
    const filteredMovies = movies.filter(
      (movie) => movie.description && movie.description.includes("A")
    );
    displayMovies(filteredMovies);
  });
}

function showCardsContainingDescriptionB() {
  // Get the input value from the description input field
  const inputDescription = document.getElementById("descriptionInput").value.toLowerCase();

  fetchMovies().then((movies) => {
    const filteredMovies = movies.filter((movie) => 
      movie.description && movie.description.toLowerCase().includes(inputDescription)
    );
    displayMovies(filteredMovies);
    document.getElementById('inputField').style.display = 'none'; // Hide the input field after submission
  });
}

function operation3() {
  // Add code for additional operation if needed
  console.log("Operation 4 clicked");
}
