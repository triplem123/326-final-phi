// Double check later if these are the only fields that we want, but this should work for more fields too
const a = {'account_info':JSON.stringify({'Username':'testuser','Email_Address':'testemail@fakeaddress.com','Password':'password123','Number_of_Rooms_Created':12,'Number_of_Room_Layouts_Created':7})};
let values = "";
let parsed_values = "";
window.localStorage.setItem("account_info", JSON.stringify(a));

// heroku old URL usage

// await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo').then(response => response.json()).then(v => {
//     if (!Object.keys(v).includes('account_info')) {
//         values = JSON.parse(a.account_info);
//         return fetch ('https://roomio-room-builder.herokuapp.com/saveAccInfo', {
//             method: 'POST',
//             headers: {
//                 'Content-type': 'application/json'
//             },
//             body: JSON.stringify(a),
//         });
//     } else {
//         values = JSON.parse(v.account_info);
//     }
// }).then(r => build());



// local usage

await fetch('http://localhost:3000/getAccInfo').then(response => response.json()).then(v => {
    if (!Object.keys(v).includes('account_info')) {
        values = JSON.parse(a.account_info);
        return fetch ('http://localhost:3000/saveAccInfo', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(a),
        });
    } else {
        values = JSON.parse(v.account_info);
    }
}).then(r => build());



// change the code above to retrieve user info from the actual database and not the fake one



function build() {
    // console.log("values:");
    // console.log(values);
    parsed_values = values;
    window.localStorage.setItem("account_info", JSON.stringify(values));
    
    const grid = document.getElementById("account-info");
    
    
    for (const [field, value] of Object.entries(parsed_values)) {
        const field_name = document.createElement("div");
        field_name.classList.add(field + "-field");
        field_name.append(field.replaceAll("_", " "));
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
}

async function saveCurrentInfo() {
    window.localStorage.setItem("account_info", JSON.stringify(parsed_values));

    let obj = {'account_info': JSON.stringify(parsed_values)};

    //heroku old URL usage

    // return fetch ('https://roomio-room-builder.herokuapp.com/saveAccInfo', {
    //     method: 'POST',
    //     headers: {
    //         'Content-type': 'application/json'
    //     },
    //     body: JSON.stringify(obj),
    // });



    // local usage

    return fetch ('http://localhost:3000/saveAccInfo', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(obj),
    });



    // change to save account info to the actual database after an edit has been committed 
}