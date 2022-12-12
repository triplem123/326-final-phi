const grid = document.getElementById("room-layout-board");
let rooms = [];

await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo').then(response => response.json()).then(v => {
    rooms = v.rooms;
});

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
            c.classList.contains("selected") ? c.classList.remove("selected") : c.classList.add("selected");
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
    
    await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo').then(response => response.json()).then(async (user) => {
        [...document.getElementsByClassName("selected")].forEach(elem => {

            const name = elem.classList[0];
            user.rooms = user.rooms.filter(r => r.roomName !== name);
            elem.remove();
        });

        await fetch('https://roomio-room-builder.herokuapp.com/updateAcc', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ 'rooms': user.rooms,
                                    'Rooms_Created': user.rooms.length }),
        });
    }); 
});

// share button
document.getElementsByClassName("share-rooms")[0].addEventListener("click", () =>{
    let url = encodeURIComponent(window.Location.href);
    let title = encodeURIComponent(window.title);
    let twitterURL = "https://twitter.com/intent/tweet?url=" + url + "&text=" + title;
    window.open(twitterURL, "twitter-share-dialog");
});
