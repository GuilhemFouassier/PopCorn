document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('#formRegister');
    const userEmail = document.querySelector('[name="email"]');
    const userPassword = document.querySelector('[name="password"]');
    const userPseudo = document.querySelector('[name="pseudo"]');
    const apiUrl = 'https://kebabtv.dwsapp.io';
    const formError = document.querySelector('#formRegister span');
    const getRegisterSubmit = () => {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            let formError = 0;

                if(userEmail.value.length < 5) { formError++ };
                if(userPassword.value.length < 5) { formError++ };
                if(userPseudo.value.length < 2) { formError++ };
            if(formError === 0){
                new FETCHrequest(`${apiUrl}/api/register`, 'POST', {
                    email: userEmail.value,
                    password : userPassword.value,
                    pseudo: userPseudo.value
                })
                .fetch()
                .then(jsonData => {
                    console.log(jsonData);
                    document.location.href="index.html";
                })
                .catch(error => {
                    displayError(error.message);
                })
            }else{
                displayError('Veuillez remplir les champs');
            }
        })
    }
    const displayError = msg => {
        formError.innerHTML = `${msg}`;
        setTimeout( () => {
            formError.innerHTML = ``;
        }, 3000)
    };

    getRegisterSubmit();
});