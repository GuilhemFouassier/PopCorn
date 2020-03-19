document.addEventListener('DOMContentLoaded', ()=> {
    /* Déclarations */
    const searchForm = document.querySelector('#searchMovie');
    const searchLabel = document.querySelector('searchMovie span')
    const searchData = document.querySelector('[name="searchData"]');
    const themoviedbUrl = 'https://api.themoviedb.org/3/search/movie?api_key=b7121cc0458344957693c216d595c487&language=en-US&query='
    const movieList = document.querySelector('#movieList');
    const moviePopin = document.querySelector('#moviePopin article');
    /* Fontions */
    const getSearchSubmit = () => {
        searchForm.addEventListener('submit', (event)=>{
            // Stop event Propagation
            event.preventDefault();
            // Check form data
            searchData.value.length > 0 
            ? fetchFunction(searchData.value)
            :  displayError(searchData, 'Minimum 1 caractère');
        });
    };
    const displayError = (tag, msg) => {
        searchLabel.textContent = msg;
        tag.addEventListener('focus', () => searchLabel.textContent = "");
    };
    const fetchFunction = (keywords, index = 1) => {
        let fetchUrl = null;
        if(typeof keywords == 'number'){
            fetchUrl = `https://api.themoviedb.org/3/movie/${keywords}?api_key=b7121cc0458344957693c216d595c487`
        }else{
            fetchUrl = themoviedbUrl + keywords + '&page=' + index;
        }

        fetch(fetchUrl)
        .then( response => response.ok ? response.json() : 'Response is not ok')
        .then(jsonData => {
            typeof keywords === 'number'
            ? displayPopin(jsonData)
            : displayMovieList(jsonData.results)
        })
        .catch(err => console.error(err));
    };

    const displayMovieList = collection => {
        searchData.value = '';
        movieList.innerHTML = ''; 
        for(let item of collection){
            movieList.innerHTML += `
                <article class="column column-25">
                    <div class="wrapper">
                        <figure>
                            <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.original_title}">
                            <figcaption>${item.vote_average}</figcaption>
                        </figure>
                        <p class="title" movie-id="${item.id}">${item.title}</p>
                    </div>
                    <div class="card">
                            <p>${item.overview}</p>
                            <button>Voir le film</button>
                        </div>
                </article>
            `;
        }
        getPopinLink(document.querySelectorAll('p.title'));
    }
    const getPopinLink = linkCollection => {
        for(let link of linkCollection){
            link.addEventListener('click', () => {
                fetchFunction( +link.getAttribute('movie-id'));
            });
        }
    };
    const displayPopin = data => {
        moviePopin.innerHTML = `
            <div>
                <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.original_title}">
            </div>
            <div>
                <h2>${data.title}</h2>
                <p>${data.overview}</p>
                <button>Voir en streaming</button>
                <button id="addFilm" film-id=${data.id}" film-title="${data.title}">Ajouter en favori</button>
                <button id="closeButton">Close</button>
            </div>
        `;
        moviePopin.parentElement.classList.add('open');
        closePopin( document.querySelector('#closeButton'));
        addFavorite(document.querySelector('#addFilm'));
    }
    const closePopin = button => {
        button.addEventListener('click', ()=>{
            button.parentElement.parentElement.parentElement.classList.add('close');
            setTimeout(()=>{
                button.parentElement.parentElement.parentElement.classList.remove('open');
                button.parentElement.parentElement.parentElement.classList.remove('close');
            })
        })
    }

    const fetchDefaultMovie = () =>{
        let config = {
            method : 'GET',
            headers: {'Content-Type': 'application/json'}
        }
        fetch("https://api.themoviedb.org/3/discover/movie?api_key=b7121cc0458344957693c216d595c487", config)
        .then(response => {
            return response.json();
        })
        .then(jsonData => {
            displayMovieList(jsonData.results);
        })
        .catch(error => {
            console.log(error)
        })
    }

    const addFavorite = (buttonFavorite) => {
        let filmToAdd = {};
        let config = {};
        let userPopCorn = localStorage.getItem('user');
        let idFilmValue = null;
        let nameFilmValue = null;
        buttonFavorite.addEventListener('click', () => {
            idFilmValue = buttonFavorite.getAttribute('film-id');
            nameFilmValue = buttonFavorite.getAttribute('film-title');
            filmToAdd = {
                author : userPopCorn,
                id : idFilmValue,
                title : nameFilmValue
            }
            config = {
                method: 'POST',
                body: JSON.stringify(filmToAdd),
                headers : { 'Content-Type': 'application/json' }
            }
            userPopCorn !== null
            ? fetchFavorite(config)
            : console.log('Connectez vous pour ajouter en favori')
        })
    }

    const fetchFavorite = (fetchData) => {
        fetch('https://api.dwsapp.io/api/favorite', fetchData)
        .then(response => {
            return response.json();
        })
        .then(jsonData => {
            console.log(jsonData);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const fetchDeleteFavorite = (movieId) => {
        return fetch('https://api.dwsapp.io/api/favorite' + '/' + movieId, {
            method: 'delete'
          }).then(response => {
                return response.json();
          }).then(jsonData => {
              console.log(jsonData);
          })
          .catch(error => {
              console.log(error);
          })
    }

    /* Lancer fonction */
    fetchDefaultMovie();
    getSearchSubmit();
});