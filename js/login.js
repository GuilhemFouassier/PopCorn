document.addEventListener('DOMContentLoaded', ()=> {
    const email = document.querySelector('#email');
    const paswd = document.querySelector('#paswd');
    const form = document.querySelector('#loginForm');
    let emailValue = null;
    let paswdValue = null;
    let fetchLoginData = {};
    let config = {};

    const checkToken = (data) => {
        fetch('https://api.dwsapp.io/api/me/' + data)
            .then(response => {
                return response.json();
            })
            .then(jsonData => {
                console.log(jsonData);
                
            })
            .catch(error => {
                console.log(error)
            })
    }

    const fetchLogin = (fetchData) => {
        fetch('https://api.dwsapp.io/api/login', fetchData)
            .then(response => {
                return response.json();
            })
            .then(jsonData => {
                localStorage.setItem("user", jsonData.data.identity._id);
                localStorage.setItem('user-pseudo', jsonData.data.identity.pseudo)
                checkToken(jsonData.data.identity._id);
                document.location.href="index.html";
            })
            .catch(error => {
                console.log(error);
            })
        }

    const getLoginSubmit = () => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            isLogin = 0;
            emailValue = email.value;
            paswdValue = paswd.value;
            if(emailValue !== null && paswdValue !== null){
                fetchLoginData = {
                    email: emailValue,
                    password : paswdValue
                }
                config = {
                    method : 'POST',
                    body : JSON.stringify(fetchLoginData),
                    headers: { 'Content-Type': 'application/json' }
                }
                fetchLogin(config);
            } else{
                Console.log('erreur de connection');
            }  
        });
    }


    //lancer la fonction
    getLoginSubmit();
});