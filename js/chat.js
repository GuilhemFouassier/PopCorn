document.addEventListener('DOMContentLoaded', ()=> {
    const chatForm = document.querySelector('#chatForm');
    const chatMessage = document.querySelector('#chatMessage');
    const localSt = 'Hello';
    const localDB = new PouchDB('chat_room');
    const remoteDB = new PouchDB('https://couch.dwsapp.io/chat_room/');
    localDB.replicate.to(remoteDB);
    localDB.replicate.from(remoteDB);
    const chatId =  () => {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return Math.random().toString(36).substr(2, 9);
    };
    // Get chatForm submit
    chatForm.addEventListener('submit', event => {
        // Stop event propagation
        event.preventDefault();
        // Check form data
        if(chatMessage.value.length > 0){
            localDB.put({
                _id:chatId(),
                author: localStorage.getItem(localSt),
                pseudo: localStorage.getItem('user-pseudo'),
                messagee: chatMessage.value
            })
            .then( pouchData => {
                console.log(pouchData)
            })
            .catch( pouchError => {
                console.log(pouchError)
            })
        }
    });
});