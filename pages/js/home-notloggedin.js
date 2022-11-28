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
    await fetch('http://localhost:3000/getAccInfo/' + hash).then(r => {
        if (r.status === 200) {
            window.localStorage.setItem("hash", hash + '');
            window.open("/home-loggedin.html", "_self");
        } else {
            window.open("/", "_self");
        }
    });
}

async function loggedIn() {
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
        await fetch('http://localhost:3000/getAccInfo/' + hash).then(r => {
            if (r.status === 200) {
                window.open("/home-loggedin.html", "_self");
            }
        });
    }
} 