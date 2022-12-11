// async function validUser() {
//     function getHash(str) {
//         let hash = 0;
//         for (let i = 0; i < str.length; i++) {
//             hash = (hash << 5) - hash + str.charCodeAt(i);
//             hash = hash & hash; 
//         }
//         return hash & 0xffff;
//     }
//     if (window.localStorage.hash !== undefined) {
//         const hash = window.localStorage.hash;
//         await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo/' + hash).then(r => {
//             if (r.status !== 200) {
//                 window.open("/", "_self");
//             }
//         });
//     } else {
//         window.open("/", "_self");
//     }
// }
// validUser();

let parsed_values = "";

// creates a new test account 
// await fetch('https://roomio-room-builder.herokuapp.com/createAcc/34933', {
//     method: 'POST',
// });

// FOR LOCAL USE/TESTING ONLY

await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo/' + window.localStorage.hash).then(response => response.json()).then(v => {
    parsed_values = v;
}).then(r => build());

// await fetch('https://roomio-room-builder.herokuapp.com/getAccInfo/testhash').then(response => response.json()).then(v => {
//     parsed_values = v;
// }).then(r => build());

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

    function getHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash = hash & hash; 
        }
        return hash & 0xffff;
    }
    
    // FOR LOCAL USE/TESTING ONLY

    const hash = getHash(parsed_values.Email + '' + parsed_values.Password) + '';
    
    await fetch('https://roomio-room-builder.herokuapp.com/updateAcc/' + window.localStorage.hash, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ 'password': parsed_values.Password,
                               'userhash': hash }),
    }).then(r => window.localStorage.setItem("hash", hash));

    // await fetch('https://roomio-room-builder.herokuapp.com/updateAcc/testhash', {
    //     method: 'POST',
    //     headers: {
    //         'Content-type': 'application/json'
    //     },
    //     body: JSON.stringify({ 'password': parsed_values.Password }),
    // });

    // DELETE
    // await fetch('https://roomio-room-builder.herokuapp.com/deleteAcc/testhash', {
    //     method: 'DELETE',
    // });

}

function logout() {
    delete window.localStorage["hash"];
    window.open("/", "_self");
}

document.getElementById("logout").addEventListener("click", event => logout());