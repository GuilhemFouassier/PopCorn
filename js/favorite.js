document.addEventListener('DOMContentLoaded', () => {
    const favoriteList = document.querySelector('#movieList');
    const moviePopin = document.querySelector('#moviePopin article');
    const checkToken = (data) => {
        fetch('https://api.dwsapp.io/api/me/' + data)
        .then(response => {
            return response.json();
        })
        .then(jsonData => {
             displayFavorite(jsonData.data.favorite);
        })
        .catch(error => {
            console.log(error)
        });
    }

    const displayFavorite = (favorite) => {
        for(let item of favorite){
            fetchFavorite(item.id);
        }
    }

    const fetchFavorite = (movieId) => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=6fd32a8aef5f85cabc50cbec6a47f92f`)
        .then( response => {
            return response.json()
        })
        .then(jsonData => {
            createCardFavorite(jsonData);
        })
    }

    const createCardFavorite = (movie) => {
        favoriteList.innerHTML += `
                <article class="column column-25">
                    <div class="wrapper">
                        <figure>
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.original_title}">
                            <figcaption>${movie.vote_average}</figcaption>
                        </figure>
                        <p class="title" movie-id="${movie.id}">${movie.title}</p>
                    </div>
                    <div class="card">
                            <p>${movie.overview}</p>
                            <button>Voir le film</button>
                        </div>
                </article>
            `;
            getPopinLink(document.querySelectorAll('p.title'));
    }

    const getPopinLink = buttonCollection => {
        for (let button of buttonCollection){
            button.addEventListener('click', () => {
                fetchPopin( +button.getAttribute('movie-id'));
            });
        }     
};

    const fetchPopin = (movieId) => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=6fd32a8aef5f85cabc50cbec6a47f92f`)
        .then( response => {
            return response.json()
        })
        .then(jsonData => {
            displayPopin(jsonData);
        })
    }

    const displayPopin = data => {
        moviePopin.innerHTML = `
            <div>
                <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.original_title}">
            </div>
            <div>
                <h2>${data.title}</h2>
                <p>${data.overview}</p>
                <button id="deleteFavorite" movie-id="${data._id}">Enlever des favoris</button>
                <button>Voir en streaming</button>
                <button id="closeButton">Close</button>
            </div>
        `;
        moviePopin.parentElement.classList.add('open');
        btnDelete(document.querySelector('#deleteFavorite'));
        closePopin( document.querySelector('#closeButton'));
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

    const btnDelete = button => {
        button.addEventListener('click', () => {
            fetchDeleteFavorite(+button.getAttribute('movie-id'));
        })
    }

    const fetchDeleteFavorite = (movieId) => {
         fetch('https://api.dwsapp.io/api/favorite/movie/' + movieId, {
            method: 'DELETE'
          }).then(response => {
                return response.json();
          }).then(jsonData => {
              console.log(jsonData);
              //document.location.href="favorite.html";
          })
          .catch(error => {
              console.log(error);
          })
    }

    checkToken(localStorage.getItem("user"));
});
