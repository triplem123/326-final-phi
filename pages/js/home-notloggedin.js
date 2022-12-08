function getHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash; 
    }
    return hash & 0xffff;
}

async function validUser() {
    const hash = getHash(document.getElementById("input-username").value + '' + document.getElementById("input-password").value);
    await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo/' + hash).then(r => {
        if (r.status === 200) {
            window.localStorage.setItem("hash", hash + '');
            window.open("/home-loggedin.html", "_self");
        } else {
            window.open("/", "_self");
        }
    });
}

async function loggedIn() {
    await fetch('https://roomio-room-builder.herokuapp.com/createAcc/34933', {
        method: 'POST',
    });
    function getHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash = hash & hash; 
        }
        return hash & 0xffff;
    }
    if (window.localStorage.hash !== undefined) {
        const hash = window.localStorage.hash;
        await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo/' + hash).then(r => {
            if (r.status === 200) {
                window.open("/home-loggedin.html", "_self");
            }
        });
    }
} 