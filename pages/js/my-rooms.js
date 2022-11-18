const grid = document.getElementById("room-layout-board");

const room_types = [
    "Master-Bedroom", 
    "Living-Room", 
    "Den", 
    "Kitchen", 
    "Downstairs-Bedroom", 
    "Basement", 
    "TV-Room"
];
//Generating sample data

room_types.forEach((room) => {
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
        }
    });

    grid.appendChild(c);
});




// change all of the above code
// change to retrieve all rooms from the user's entry in the database 
// and build out the entries in the grid from the names of the rooms in the database




const c = document.createElement("div");
c.classList.add("room-type-grid-item");
const b = document.createElement("button");
b.type = "button";
b.classList.add("create-new-room");
b.classList.add("folder-button");
b.innerText = "Create New Room";

const d = document.createElement('a');
d.href = "/room-builder.html";
d.appendChild(b);

c.appendChild(d);
grid.appendChild(c);

// Trying to select grid items now
document.getElementById("select-rooms").addEventListener("click", ()=>{
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
document.getElementsByClassName("delete-rooms")[0].addEventListener("click", () =>{
    document.getElementById("select-rooms").classList.remove("selector-selected");
    [...document.getElementsByClassName("selected")].forEach(elem =>{
        elem.remove();
    });
});