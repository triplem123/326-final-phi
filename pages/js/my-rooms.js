const html2canvas = require("html2canvas");

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

const grid = document.getElementById("room-layout-board");
let rooms = [];

// FOR LOCAL USE/TESTING ONLY

await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo/' + window.localStorage.hash).then(response => response.json()).then(v => {
    rooms = v.rooms;
});

// await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo/testhash').then(response => response.json()).then(v => {
//     rooms = v.rooms;
// });

rooms.forEach((room_obj) => {
    const room = room_obj.roomName;
    const c = document.createElement("div");
    c.classList.add(room);
    c.classList.add("room-type-grid-item");
    const b = document.createElement("button");
    b.type = "button";
    b.classList.add(room);
    b.classList.add("folder-button");

    const i = document.createElement("span");
    i.classList.add("glyphicon"); 
    i.classList.add("glyphicon-file");

    b.appendChild(i);

    b.append(document.createElement("br"));
    b.append(room.replaceAll("-", " "));

    c.appendChild(b);

    c.addEventListener("click", () => {
        if (document.getElementById("select-rooms").classList.contains("selector-selected")) {
            c.classList.add("selected");
        } else {
            const storage = window.localStorage;
            storage.setItem('roomName', room);
            storage.setItem('corners', room_obj.corners);
            storage.setItem('furniture', room_obj.furniture);
            window.open("/room-builder.html", "_self");
        }
    });

    grid.appendChild(c);
});



// add a function that will delete rooms from the user's database entry when they're deleted on the my rooms page



const c = document.createElement("div");
c.classList.add("room-type-grid-item");
const b = document.createElement("button");
b.type = "button";
b.classList.add("create-new-room");
b.classList.add("folder-button");
b.innerText = "Create New Room";
b.onclick = () => {
    delete window.localStorage['roomName'];
    delete window.localStorage['corners'];
    delete window.localStorage['furniture'];
}

const d = document.createElement('a');
d.href = "/room-builder.html";
d.appendChild(b);

c.appendChild(d);
grid.appendChild(c);

// Trying to select grid items now
document.getElementById("select-rooms").addEventListener("click", () => {
    if (document.getElementById("select-rooms").classList.contains("selector-selected")) {
        document.getElementById("select-rooms").classList.remove("selector-selected");
        [...document.getElementsByClassName("selected")].forEach(elem => {
            elem.classList.remove("selected");
        });
    } else {
        document.getElementById("select-rooms").classList.add("selector-selected");
    }
});

// delete button
document.getElementsByClassName("delete-rooms")[0].addEventListener("click", async () =>{
    document.getElementById("select-rooms").classList.remove("selector-selected");
    
    // FOR LOCAL USE/TESTING ONLY
    
    await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo/' + window.localStorage.hash).then(response => response.json()).then(async (user) => {
        // console.log(user);
        [...document.getElementsByClassName("selected")].forEach(elem => {

            const name = elem.classList[0];
            user.rooms = user.rooms.filter(r => r.roomName !== name);
            elem.remove();
        });

        await fetch('https://roomio-room-builder.herokuapp.com/updateAcc/' + window.localStorage.hash, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ 'rooms': user.rooms,
                                    'Rooms_Created': user.rooms.length }),
        });
    }); 

    // await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo/testhash').then(response => response.json()).then(async (user) => {
    //     // console.log(user);
    //     [...document.getElementsByClassName("selected")].forEach(elem => {

    //         const name = elem.classList[0];
    //         user.rooms = user.rooms.filter(r => r.roomName !== name);
    //         elem.remove();
    //     });

    //     await fetch('https://roomio-room-builder.herokuapp.com/updateAcc/testhash', {
    //         method: 'POST',
    //         headers: {
    //             'Content-type': 'application/json'
    //         },
    //         body: JSON.stringify({ 'rooms': user.rooms,
    //                                 'Rooms_Created': user.rooms.length }),
    //     });
    // });
});

// share button
document.getElementsByClassName("share-rooms")[0].addEventListener("click", () =>{
    let url = encodeURIComponent(window.Location.href);
    let title = encodeURIComponent(window.title);
    let twitterURL = "https://twitter.com/intent/tweet?url=" + url + "&text=" + title;
    window.open(twitterURL, "twitter-share-dialog");
});

document.getElementsByClassName("save-rooms")[0].addEventListener("click", () =>{

    html2canvas(document.body).then((canvas) =>{
        const ss_link = canvas.toDataURL("image/jpeg");
        const link = document.createElement("a");
        link.download = "room.jpeg";
        link.href = ss_link;
        link.click();
    });
});