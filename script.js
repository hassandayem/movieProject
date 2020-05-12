'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  const genres = await fetchGenres();
  renderMovies(movies.results);
  renderGenres(genres.genres, movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};


// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const movieCast = await fetchCast(movie.id);
  const movieTrailer = await fetchTrailer(movie.id);
  const relatedMovie = await fetchSimilar(movie.id);
  
  renderMovie(movieRes);
  renderCast(movieCast);
  renderTrailer(movieTrailer);
  renderSimilar(relatedMovie);
  
  
};

//NavBar Search field

//Prevent dafualt behaviour for form
function stopSending(event) {
  event.preventDefault();
  return false;
}

//-- Fetch the results --//
const fetchSearchMovie = async (word) => {
  const url = constructUrl(`search/movie`);
  const searchUrl = `${url}&query=${word}`
  console.log(searchUrl)
  const res = await fetch(searchUrl);
  return res.json();
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

const fetchCast = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};

const fetchTrailer = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`);
  const res = await fetch(url);
  return res.json();
};

const fetchSimilar = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
}

//Burak
const fetchGenres = async () => {
  const url = constructUrl(`genre/movie/list`);
  const res = await fetch(url);
  return res.json();
};

const fetchLatest = async () => {
  const url = constructUrl(`movie/latest`);
  const res = await fetch(url);
  return res.json();
};


const fetchPopulars = async () => {
  const url = constructUrl(`movie/popular`);
  const res = await fetch(url);
  return res.json();
};

const fetchTopRateds = async () => {
  const url = constructUrl(`movie/top_rated`);
  const res = await fetch(url);
  return res.json();
};

const fetchUpcomings = async () => {
  const url = constructUrl(`movie/upcoming`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  console.log('Movies', movies);
  getMoviesBy();
  const movieRow = document.createElement("div")
  movieRow.className = "row";

  movies.map((movie) => {

    const movieDiv = document.createElement("div");
    movieDiv.classList = "col-md-4"
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
      } poster" class = "main-poster-img" width = 100%>
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });

    movieRow.appendChild(movieDiv)
    CONTAINER.appendChild(movieRow)

  });

};

const renderSearchMovies = async () => {
  const searchField = document.getElementById("start-search");
  const word = searchField.value;
  console.log(word)
  const data = await fetchSearchMovie(word);
  clearMovies();
  renderMovies(data.results);
  //console.log(searchMovie.results)
  /* const movieRow = document.createElement("div")
  movieRow.className = "row";

  searchMovie.map((movie) => {

    const movieDiv = document.createElement("div");
    movieDiv.classList = "col-md-4"
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
      } poster" class = "main-poster-img" width = 100%>
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });

    movieRow.appendChild(movieDiv)
    CONTAINER.appendChild(movieRow)

  }); */
}

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
    BACKDROP_BASE_URL + movie.backdrop_path
    }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
    movie.release_date
    }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
            <div class = "row mb-3">
            <div class = "col-md-4">
            <h5 id = "director">Director: </h5></div>
            <div class = "col-md-4"><h5>Language: ${movie.original_language}</h5></div>

            </div>
            
            <div class = "row mb-3">
            <div class = "col-md-4"><h5>Rating: </h5>${movie.vote_average}</div>
            <div class = "col-md-4"><h5>Votes: </h5>${movie.vote_count}</div>
            </div>

            <div class = "row mb-3">
            <div class = "col-md-4 d-flex align-items-center"><h5>Production Company: ${movie.production_companies[0]["name"]}</h5></div>
            <div class = "col-md-4 d-flex align-items-center"><img src="${BACKDROP_BASE_URL + movie.production_companies[0]["logo_path"]}" alt="${movie.production_companies[0]["name"]} logo" width = 50px></div>
            </div>

        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>

            <h3 id = "trailer">Trailer: </h3>
            <div id = "video-container"></div>
            <h3>Related Movies:</h3>
            <ul id="related" class="list-unstyled"></ul>
            
    </div>`;


};

const renderCast = (movie) => {
  console.log(movie.cast[20]);
  const actors = document.getElementById("actors");
  for (let i = 0; i < 5; i++) {
    const actorLi = document.createElement("li")
    const actorName = document.createTextNode(movie.cast[i]["name"])
    actorLi.className = "inline-list"
    actorLi.appendChild(actorName);
    actors.appendChild(actorLi);
  }


  for (let i = 0; i < movie.crew.length; i++) {
    if (movie.crew[i]["job"] === "Director") {
      //console.log(movie.crew[i]["name"])
      const direName = movie.crew[i]["name"];
      //console.log(direName)
      //console.log("textNode", directorName)

      const directorHeading = document.getElementById("director")
      const directorName = document.createTextNode(direName);
      directorHeading.appendChild(directorName)
    }
  }
}

const renderTrailer = (movie) => {
  //console.log(movie.results[0]["key"])
  const urlId = movie.results[0]["key"]
  const urlFirstSection = "https://www.youtube-nocookie.com/embed/"
  const videoContainer = document.querySelector("#video-container");
  const trailerFrame = `<iframe width="560" height="315" src= "${urlFirstSection + urlId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`

  //console.log(trailerFrame)

  videoContainer.innerHTML = trailerFrame;

}


const renderSimilar = (movie) => {
  const relatedContainer = document.querySelector("#related");
  console.log(movie.results[0])
  for (let i = 0; i < 5; i++) {
    const similarLi = document.createElement("li")
    similarLi.className = "inline-list"
    const similarTitle = document.createTextNode(movie.results[i]["title"])
    const similarPosterImg = document.createElement("img")
    similarPosterImg.setAttribute("src", `${BACKDROP_BASE_URL + movie.results[i]["poster_path"]}`)
    similarPosterImg.setAttribute("class", "related-poster")
    similarLi.appendChild(similarPosterImg)
    similarLi.appendChild(similarTitle)
    
    relatedContainer.appendChild(similarLi);
    
    similarLi.addEventListener("click", () => {
      movieDetails(movie); 
  }
    )}
}


//Burak
const renderGenres = (genres, movies) => {
  renderMenuList(genres, movies);
}

const renderMenuList = (genres, movies) => {
  const dropdownMenu = document.querySelector('#genre-menu');
  genres.forEach(genre => {
    const aTag = document.createElement('a');
    aTag.addEventListener('click', function (e) {
      renderMoviesByGenre(parseInt(e.target.id), movies);
    })
    aTag.classList.add('dropdown-item');
    aTag.setAttribute('href', '#');
    aTag.setAttribute('id', genre.id);
    aTag.innerHTML = genre.name;
    dropdownMenu.appendChild(aTag);
  });
};

const renderMoviesByGenre = (genreId, movies) => {
  clearMovies();
  const filteredMovies = movies.filter(movie => {
    return movie.genre_ids.includes(genreId);
  });
  filteredMovies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
      } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

const getMoviesBy = () => {
  const sortByList = document.querySelectorAll('#sort-list a');
  sortByList.forEach(item => {
    item.addEventListener('click', async function (event) {
      const sorting = event.target.id;
      let popular;
      if (event.target.id === 'popular') {
        const movies = await fetchPopulars();

      }
    });
  });
}



///Working on Realted Movies.

//1. Work on fetching data.
//2. Work on displaying data on Container class.





const clearMovies = () => {
  CONTAINER.innerHTML = '';
};

document.addEventListener("DOMContentLoaded", autorun);


