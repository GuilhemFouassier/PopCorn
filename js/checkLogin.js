document.addEventListener('DOMContentLoaded', () => {
    const btnDisconnected = document.querySelector('header #disconnected');
    const url = document.location.href;

    const changeNavbar= () =>{
        if(localStorage.getItem("user")){
            document.querySelector('header #connection').parentElement.classList.add('hidden');
            document.querySelector('header #inscription').parentElement.classList.add('hidden');
            document.querySelector('header #favorite').parentElement.classList.add('show');
            document.querySelector('header #chat').parentElement.classList.add('show');
            document.querySelector('header #profil').parentElement.classList.add('show');
            document.querySelector('header #disconnected').parentElement.classList.add('show'); 
            document.querySelector('header #chat').parentElement.classList.add('show');
        } else {
            document.querySelector('header #connection').parentElement.classList.add('show');
            document.querySelector('header #inscription').parentElement.classList.add('show');
            document.querySelector('header #favorite').parentElement.classList.add('hidden');
            document.querySelector('header #profil').parentElement.classList.add('hidden');
            document.querySelector('header #profil').parentElement.classList.add('hidden');
            document.querySelector('header #disconnected').parentElement.classList.add('hidden');
            document.querySelector('header #chat').parentElement.classList.add('hidden');
        }
    }

    const disconnectProfil = () => {
        btnDisconnected.addEventListener('click', (addEventListener)=>{
            event.preventDefault();
            localStorage.removeItem("user");
            location.reload();
        })
    }
    
    /* Lancer fonction */
    changeNavbar();
    disconnectProfil();
});