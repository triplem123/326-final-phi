const room_types = ["Bedroom", "Living Room", "Den", "Kitchen"];
const grid = document.getElementById("room-layout-board");


//Generating sample data

room_types.forEach((room) => {
    const c = document.createElement("div");
    // c.classList.add(room);
    c.classList.add("grid-item");
    c.innerText = room;
    grid.appendChild(c);
});

const c = document.createElement("div");
c.classList.add("grid-item");
const b = document.createElement("button"); // change type to button if necessary
b.type = "button";
b.classList.add("create-new-room");
b.classList.add("button");
b.innerText = "Create a New Room";

c.appendChild(b);
grid.appendChild(c);