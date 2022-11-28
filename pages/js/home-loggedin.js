async function validUser() {
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
            if (r.status !== 200) {
                window.open("/", "_self");
            }
        });
    } else {
        window.open("/", "_self");
    }
}
validUser();

function logout() {
    delete window.localStorage["hash"];
    window.open("/", "_self");
}

document.getElementById("logout").addEventListener("click", event => logout());