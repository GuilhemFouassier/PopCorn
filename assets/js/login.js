document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#formLogin');
    const userEmail = document.querySelector('[name="email"]');
    const userPassword = document.querySelector('[name="password"]');
    const apiUrl = 'https://kebabtv.dwsapp.io';
    const formError = document.querySelector('#formLogin span');
    const btnMobile = document.querySelector('footer button');
    const menu = document.querySelector('header');

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
                    .sendRequest()
                    .then(jsonData => {
                        localStorage.setItem('user_id', jsonData.data.user._id);
                        localStorage.setItem('user_pseudo', jsonData.data.user.pseudo);
                        localStorage.setItem('user_token', jsonData.data.token);
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

    const MenuMobile = () => {
        btnMobile.addEventListener('click', (event)=> {
            event.preventDefault();
            if(btnMobile.classList.contains("close")){
                menu.classList.remove('menu-open');
                btnMobile.classList.remove('close')
            }else{
                menu.classList.add('menu-open');
                btnMobile.classList.add('close');
            }
            
        })
    }

    getLoginSubmit();
    MenuMobile();
});