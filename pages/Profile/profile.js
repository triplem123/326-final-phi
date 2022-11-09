const fields = ["Username", "Email-Address", "Password", "Number-of-Rooms-Created", "Number-of-Room-Layouts-Created"];
// Double check later if these are the only fields that we want, but this should work for more fields too

const grid = document.getElementById("account-info");

fields.forEach(field => {
    const field_name = document.createElement("div");
    field_name.classList.add(field + "-field");
    field_name.append(field.replaceAll("-", " "));
    field_name.classList.add("account-info-item");

    let field_info = {};

    if (field === "Username" || field === "Password") {
        field_info = document.createElement("input");
        field_info.type = "text";
        field_info.readOnly = true;
        field_info.classList.add(field + "-display");
        field_info.classList.add("account-text-item");
        field_info.value = "sample info";
    } else {
        field_info = document.createElement("div");
        field_info.classList.add(field + "-display");
        field_info.classList.add("account-info-item");
        field_info.append("sample info");
    }

    grid.appendChild(field_name);
    grid.appendChild(field_info);

    let editable = {};

    if (field === "Username" || field === "Password") {
        editable = document.createElement("button");
        editable.classList.add("edit-" + field);
        editable.classList.add("account-info-item");

        const icon = document.createElement("span");
        icon.classList.add("glyphicon");
        icon.classList.add("glyphicon-pencil");

        editable.appendChild(icon);
        // add ability to edit the display field with this icon

        // editable.onclick = allowEdit(field);
        editable.addEventListener("click", () => {
            const fieldToEdit = document.getElementsByClassName(field + "-display")[0];
            if (fieldToEdit.readOnly) {
                if ([...document.getElementsByClassName("account-text-item")].reduce((a, c) => a = c.readOnly === false ? a+1 : a, 0) > 0) {
                    return;
                }
                fieldToEdit.readOnly = false;
                icon.classList = "";
                icon.classList.add("glyphicon");
                icon.classList.add("glyphicon-floppy-disk");
            } else {
                fieldToEdit.readOnly = true;
                icon.classList = "";
                icon.classList.add("glyphicon");
                icon.classList.add("glyphicon-pencil");
            }
        });
    } else {
        editable = document.createElement("div");
    }
    grid.appendChild(editable);
});