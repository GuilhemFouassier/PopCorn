document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#formLogin');
    const userEmail = document.querySelector('[name="email"]');
    const userPassword = document.querySelector('[name="password"]');
    const apiUrl = 'https://kebabtv.dwsapp.io';
    const formError = document.querySelector('#formLogin span');

    const getLoginSubmit = () => {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            let formError = 0;

                if(userEmail.value.length < 5) { formError++ };
                if(userPassword.value.length < 5) { formError++ };
                if(formError === 0){
                    new FETCHrequest(`${apiUrl}/api/login`, 'POST', {
                        email: userEmail.value,
                        password : userPassword.value
                    })
                    .fetch()
                    .then(jsonData => {
                        localStorage.setItem('user_id', jsonData.data.user._id);
                        localStorage.setItem('user_pseudo', jsonData.data.use.pseudo);
                        document.location.href="index.html";
                    })
                    .catch(error => {
                        displayError(error.message);
                    })
                }
                else{
                    displayError('Veuillez remplir les champs');
                }
        });
    }
    const displayError = msg => {
        formError.innerHTML = `${msg}`;
        setTimeout( () => {
            formError.innerHTML = ``;
        }, 3000)
    };

    getLoginSubmit();
});