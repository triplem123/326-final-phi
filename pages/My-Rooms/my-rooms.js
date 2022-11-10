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
    i.classList.add("glyphicon-folder-open");

    b.appendChild(i);

    b.append(document.createElement("br"));
    b.append(room.replaceAll("-", " "));

    c.appendChild(b);
    grid.appendChild(c);
});

const c = document.createElement("div");
c.classList.add("room-type-grid-item");
const b = document.createElement("button");
b.type = "button";
b.classList.add("create-new-room");
b.classList.add("folder-button");
b.innerText = "Create New Room";

const d = document.createElement('a');
d.href = "../Room-Builder/room-builder.html";
d.appendChild(b);

c.appendChild(d);
grid.appendChild(c);

// Trying to select grid items now
document.getElementById("select-rooms").addEventListener("click", ()=>{
    document.getElementById("select-rooms").classList.contains("selector-selected") ? 
    document.getElementById("select-rooms").classList.remove("selector-selected") : 
    document.getElementById("select-rooms").classList.add("selector-selected");

    [...document.getElementsByClassName("folder-button")].forEach(elem =>{
        elem.addEventListener("click", () =>{
            if (elem.classList.contains("selected")){
                elem.classList.remove("selected");
            } else{
                let cur_room = elem.className.split(" ")[0] + "-room-selected"
                elem.classList.add("selected");
            }
        });
    });
});

// delete button
document.getElementsByClassName("delete-rooms").addEventListener("click", () =>{
    [...document.getElementsByClassName("selected").forEach(elem =>{
        elem.remove();
    })]
});