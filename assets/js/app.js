document.addEventListener('DOMContentLoaded', ()=> {
    /* Déclarations */
    const searchForm = document.querySelector('#searchMovie');
    const searchLabel = document.querySelector('#searchMovie label span');
    const searchData = document.querySelector('#searchData');
    const theMoviedbUrlSearch = 'https://api.themoviedb.org/3/search/movie?api_key=b7121cc0458344957693c216d595c487';
    const theMoviedbUrlDiscover = 'https://api.themoviedb.org/3/discover/movie?api_key=b7121cc0458344957693c216d595c487';
    const movieList = document.querySelector('#movieList');
    const moviePopin = document.querySelector('#moviePopin article');
    const apiUrl = 'https://api.dwsapp.io';
    const FavoriteContainer = document.querySelector('#favoriteList');
    const favoriteList = document.querySelector('#favoriteList ul');
    const NavConnected = document.querySelector('#connectedList');
    const NavDisconnected = document.querySelector('#disconnectedList');
    const profile = document.querySelector('#connectedList span');
    const btnDisconnected = document.querySelector('#disconnected');
    /* Fontions */
    const checkUserToken = (step) => {
        if(localStorage.getItem('user_id')){
            new FETCHrequest(`${apiUrl}/api/me/${localStorage.getItem('user_id')}`,'GET')
            .fetch()
            .then(jsonData => {
                if(step === 'favorite'){
                    displayFavorite(jsonData.data.favorite);
                }
                else{
                    profile.innerHTML = `Hello ${jsonData.data.user.pseudo}`;
                    NavConnected.classList.remove('hidden');
                    NavDisconnected.classList.add('hidden');
                    FavoriteContainer.classList.remove('hidden');
                    displayFavorite(jsonData.data.favorite);
                }
            })
            .catch(error => {
               console.log(error);
            })
        }else{
            NavConnected.classList.add('hidden');
            NavDisconnected.classList.remove('hidden');
            FavoriteContainer.classList.add('hidden');
        }
    }

    const disconnectProfil = () => {
        btnDisconnected.addEventListener('click', (event)=>{
            event.preventDefault();
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_pseudo');
            location.reload();
        })
    }

    const fetchDefaultMovie = () => {
        new FETCHrequest(`${theMoviedbUrlDiscover}`, 'GET')
        .fetch()
        .then(jsonData => {
            displayMovieList(jsonData.results);
        })
        .catch(error => {
            console.log(error);
        })
    }
    const getSearchSubmit = () => {
        searchForm.addEventListener('submit', (event)=>{
            // Stop event Propagation
            event.preventDefault();
            // Check form data
            if(searchData.value.length > 0 ){
                new FETCHrequest(`${theMoviedbUrlSearch}&query=${searchData.value}&page=1`, 'GET')
                .fetch()
                .then(jsonData => {
                    displayMovieList(jsonData.results);
                })
                .catch( error => {
                    console.log(error);
                })
            }
            else{
                displayError('Veuillez remplir le champ');
            }
        });
    };
    const displayError = msg => {
        searchLabel.innerHTML = `${msg}`;
        setTimeout( () => {
            searchLabel.innerHTML = ``;
        }, 3000)
    };
    const displayMovieList = collection => {
        searchData.value = '';
        movieList.innerHTML = '';

        for( let item of collection){
            movieList.innerHTML += `
            <article class="column column-25">
                <div class="wrapper">
                    <figure>
                        <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.original_title}">
                        <figcaption>${item.vote_average}</figcaption>
                    </figure>
                    <p class="title" movie-id="${item.id}">${item.title}</p>
                </div>
            </article>
            `;
        };
        getPopinLink( document.querySelectorAll('p.title') );
    };

    const getPopinLink = linkCollection => {
        for(let link of linkCollection){
            link.addEventListener('click', () =>{
                new FETCHrequest(`https://api.themoviedb.org/3/movie/${link.getAttribute('movie-id')}?api_key=b7121cc0458344957693c216d595c487`)
                .fetch()
                .then(jsonData => {
                    displayPopin(jsonData);
                })
                .then(error => {
                    console.log(error);
                })
            })
        }
    }

    const displayPopin = data => {
        moviePopin.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.original_title}">
                <h2>${data.title}</h2>
                <p>${data.overview}</p>
                <button>Voir en streaming</button>
                <button id="addFilm" film-id=${data.id}" film-title="${data.title}"><i class="fas fa-star"></i></button>
                <button id="closeButton">Close</button>
        `;
        moviePopin.parentElement.classList.add('open');
        closePopin( document.querySelector('#closeButton'));
        addFavorite(document.querySelector('#addFilm'), data)
    }

    const closePopin = button => {
        button.addEventListener('click', ()=>{
            button.parentElement.parentElement.classList.add('close');
            setTimeout(()=>{
                button.parentElement.parentElement.classList.remove('open');
                button.parentElement.parentElement.classList.remove('close');
            })
        })
    }
    const addFavorite = (tag, data) => {
        tag.addEventListener('click', () => {
            new FETCHrequest(`${apiUrl}/api/favorite`, 'POST', { 
                author: localStorage.getItem('user_id'),
                id: data.id,
                title: data.original_title
            })
            .fetch()
            .then( jsonData => {
                checkUserToken('favorite')
            })
            .catch( error => {
                displayError(error.message)
            })
        })
    }

    const displayFavorite = collection => {
        favoriteList.innerHTML = '';
        for(let item of collection){
            favoriteList.innerHTML += `
                <li>
                    <button id="deleteFavorite" movie-id="${item._id}"><i class="fas fa-trash"></i></button>
                    <span  movie-id="${item.id}">${item.title}</span>
                </li>
            `;
        };
        getPopinLink( document.querySelectorAll('#favoriteList li span') );
        deleteFavorite(document.querySelectorAll('#deleteFavorite'))
    }

    const deleteFavorite = favorites => {
        for( let item of favorites ){
            item.addEventListener('click', () => {
                new FETCHrequest( `${apiUrl}/api/favorite/${item.getAttribute('movie-id')}`, 'DELETE' )
                .fetch()
                .then( jsonData => checkUserToken('favorite'))
                .catch( error => {
                    console.log(error)
                })
            })
        }
    }

    /* Lancer fonction */
    fetchDefaultMovie();
    getSearchSubmit();
    disconnectProfil();
    checkUserToken();
});