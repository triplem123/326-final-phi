const grid = document.getElementById("furniture-grid-container");

const living_room = [
    "One-Seat-Sofa",
    "Two-Seat-Sofa",
    "Three-Seat-Sofa",
    "Large-Chair",
    "Small-Chair",
    "Coffee-Table",
    "Ottoman",
    "TV-Stand",
    "Fireplace",
    "Accent-Chest"
];

const bedroom = [
    "One-Person-Bed",
    "Two-Person-Bed",
    "Night-Stand",
    "Drawer-Chest",
    "Wardrobe"
];

const dining_room = [
    "Square-Dining-Table",
    "Rectangular-Dining-Table",
    "Circular-Dining-Table",
    "Large-Dining-Chair",
    "Small-Dining-Chair",
    "Bar-Stool",
    "Serving-Counter",
    "China-Cabinet"
];

const office = [
    "Drawerless-Desk",
    "Left-Side-Drawer-Desk",
    "Right-Side-Drawer-Desk",
    "Both-Sides-Drawer-Desk",
    "Bookcase",
    "Office-Chair",
    "Treadmill"
];

const structures = [
    "Left-Opening-Door",
    "Right-Opening-Door",
    "French-Doors",
    "Sliding-Door",
    "Wall-Outlet",
    "Window",
    "Rug",
    "Stairs"
];

const furniture_types = [{"Living-Room": living_room}, {"Bedroom": bedroom}, {"Dining-Room": dining_room}, {"Office": office}, {"Structures": structures}];

furniture_types.forEach(obj => {
    const type = Object.keys(obj)[0];
    const furniture_arr = obj[type];
    const category = document.createElement("button");
    category.classList.add(type);
    category.classList.add("category-button");
    category.innerText = type.replaceAll("-", " ");
    category.addEventListener("click", event => changeVisibility(event.target));

    const furniture_container = document.createElement("div");
    furniture_container.classList.add(type);
    furniture_container.classList.add("container-for-new-draggable-ui-items");
    if (category.innerText !== "Living Room") {
        furniture_container.classList.add("--inactive");
    } 

    furniture_arr.forEach(ftype => {
        const n = document.createElement("div");
        n.classList.add(ftype);
        n.classList.add("draggable-item");
        n.innerText = ftype.replaceAll("-", " ");

        const i = document.createElement("img");
        i.id = (ftype + "-image");
        i.classList.add(ftype + "-image");
        i.src = "/app/assets/furniture-images/" + ftype + ".png";
        n.appendChild(document.createElement("br"));
        n.appendChild(i);

        furniture_container.appendChild(n);
    });

    grid.appendChild(category);
    grid.appendChild(furniture_container);

    // event listener function for making ui items visible/invisible
    function changeVisibility(target) {
    let classList = document.getElementsByClassName(target.classList[0] + " container-for-new-draggable-ui-items")[0].classList;
    if (classList.contains("--inactive")) {
        const documents = document.getElementsByClassName("container-for-new-draggable-ui-items");
        for (let i = 0; i < documents.length; ++i) {
            const doc = documents[i];
            if (!doc.classList.contains("--inactive")) {
                doc.classList.add("--inactive");
            }
        }

        classList.remove("--inactive");
    }
    }
});