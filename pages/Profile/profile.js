const fields = ["Username", "Email-Address", "Password", "Number-of-Rooms-Created", "Number-of-Room-Layouts-Created"];
// Double check later if these are the only fields that we want, but this should work for more fields too

const grid = document.getElementById("account-info");

fields.forEach(field => {
    const field_name = document.createElement("div");
    field_name.classList.add(field + "-field");
    field_name.append(field.replaceAll("-", " "));
    field_name.classList.add("account-info-item");

    const field_info = document.createElement("div");
    field_info.classList.add(field + "-display");
    field_info.append("sample info");
    field_info.classList.add("account-info-item");

    grid.appendChild(field_name);
    grid.appendChild(field_info);

    let editable = {};

    if (field === "Username" || field === "Email-Address" || field === "Password") {
        editable = document.createElement("button");
        editable.classList.add("edit-" + field);
        editable.classList.add("account-info-item");

        const icon = document.createElement("span");
        icon.classList.add("glyphicon");
        icon.classList.add("glyphicon-pencil");

        editable.appendChild(icon);
        // add ability to edit the display field with this icon
    } else {
        editable = document.createElement("div");
    }
    grid.appendChild(editable);
});