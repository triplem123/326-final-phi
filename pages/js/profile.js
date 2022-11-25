let parsed_values = "";

// creates a new test account 
// await fetch('http://localhost:3000/createAcc/testhash', {
//     method: 'POST',
// });

// FOR LOCAL USE/TESTING ONLY

// await fetch('http://localhost:3000/getAccInfo/testhash').then(response => response.json()).then(v => {
//     parsed_values = v;
// }).then(r => build());

await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo/testhash').then(response => response.json()).then(v => {
    parsed_values = v;
}).then(r => build());

function build() {
    
    const grid = document.getElementById("account-info");
    
    for (const [field, value] of Object.entries(parsed_values)) {
        if (field.charAt(0) === field.charAt(0).toUpperCase() && field.charAt(0) !== '_') {
            const field_name = document.createElement("div");
            field_name.classList.add(field + "-field");
            field_name.append(field.replaceAll("_", " "));
            field_name.classList.add("account-info-item");
        
            let field_info = {};
        
            if (field === "Password") {
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
        
            if (field === "Password") {
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
}

async function saveCurrentInfo() {
    
    // FOR LOCAL USE/TESTING ONLY
    
    // await fetch('http://localhost:3000/updateAcc/testhash', {
    //     method: 'POST',
    //     headers: {
    //         'Content-type': 'application/json'
    //     },
    //     body: JSON.stringify({ 'password': parsed_values.Password }),
    // });

    await fetch('https://roomio-room-builder.herokuapp.com/updateAcc/testhash', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ 'password': parsed_values.Password }),
    });

    // DELETE
    // await fetch('http://localhost:3000/deleteAcc/testhash', {
    //     method: 'DELETE',
    // });

}