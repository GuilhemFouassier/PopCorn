document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.querySelector('#registerForm');
    let email = document.querySelector('#email');
    let pseudo = document.querySelector('#pseudo');
    let paswd = document.querySelector('#paswd');
    let emailValue = null;
    let pseudoValue = null;
    let paswdValue = null;
    let fetchRegisterData = {};
    let config = {};

    const fetchRegister = (fetchData) => {
        fetch('https://api.dwsapp.io/api/register', fetchData)
        .then(response => {
            return response.json();
        })
        .then(jsonData => {
            console.log(jsonData);
            document.location.href="index.html"
        })
        .catch(error=>{
            console.log(error);
        })
    }

    const getRegisterSubmit = () => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            emailValue = email.value;
            pseudoValue = pseudo.value;
            paswdValue = paswd.value;
            if(emailValue !== null && pseudoValue !== null && paswdValue !== null && pseudoValue.length > 4 && paswdValue.length > 4){
                fetchRegisterData = {
                    email: emailValue,
                    password: paswdValue,
                    pseudo: pseudoValue
                }
                config = {
                    method: 'POST',
                    body: JSON.stringify(fetchRegisterData),
                    headers: { 'Content-Type': 'application/json' }
                }
                fetchRegister(config);
            }else{
                console.log('erreur lors de l\inscription');
            }
            form.reset();
        })
    }

    getRegisterSubmit();
});