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

c.appendChild(b);
grid.appendChild(c);