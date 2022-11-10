import { getAccountDetails, saveAccountDetails } from "../../server/server.js";

// document.getElementById("header").addEventListener("click", saveCurrentInfo);
// document.getElementById("my-rooms").addEventListener("click", saveCurrentInfo);
// document.getElementById("logout").addEventListener("click", saveCurrentInfo);

// Double check later if these are the only fields that we want, but this should work for more fields too
const values = getAccountDetails("abc123");
let parsed_values = JSON.parse(values);
window.localStorage.setItem("account_info", values);

const grid = document.getElementById("account-info");


for (const [field, value] of Object.entries(parsed_values)) {
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
        field_info.value = value;
    } else {
        field_info = document.createElement("div");
        field_info.classList.add(field + "-display");
        field_info.classList.add("account-info-item");
        field_info.append(value);
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
                parsed_values[fieldToEdit.classList[0].split("-")[0]] = fieldToEdit.value;
                saveCurrentInfo();
            }
        });
    } else {
        editable = document.createElement("div");
    }
    grid.appendChild(editable);
}

function saveCurrentInfo() {
    saveAccountDetails("abc123", JSON.stringify(parsed_values));
    window.localStorage.setItem("account_info", JSON.stringify(parsed_values));
}