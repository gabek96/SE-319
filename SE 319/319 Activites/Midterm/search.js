// search.js
  
  // Function to display search results
  function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = ''; // Clear previous results
  
    if (results.length === 0) {
      searchResultsContainer.innerHTML = '<p>No results found.</p>';
    } else {
      results.forEach(comic => {
        const resultCard = `
          <div class="result-card">
            <img src="${comic.image_url}" alt="${comic.title}" class="result-image">
            <div class="result-info">
              <h3>${comic.title}</h3>
              <p><strong>Author:</strong> ${comic.author}</p>
              <p><strong>Genre:</strong> ${comic.genre}</p>
              <p>${comic.description}</p>
            </div>
          </div>
        `;
  
        searchResultsContainer.innerHTML += resultCard;
      });
    }
  }
  
  // Function to search comics by title or author
  function searchComics(query) {
    const results = comics.filter(comic => 
      comic.title.toLowerCase().includes(query.toLowerCase()) ||
      comic.author.toLowerCase().includes(query.toLowerCase())
    );
  
    displaySearchResults(results);
  }
  
  // Add event listener to search input
  document.getElementById('search-input').addEventListener('input', function(event) {
    const query = event.target.value;
    searchComics(query);
  });
  