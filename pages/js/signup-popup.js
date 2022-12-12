function openForm() {
    document.getElementById("myForm").style.display = "block";
    window.scrollTo(0, document.body.scrollHeight);
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

async function signUp() {
    document.getElementById("input-username").required = false;
    document.getElementById("input-password").required = false;

    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    if (password.length <= 5) {
        alert("Password is not long enough.")
        return false;
    } else if (!username.includes("@") || !username.includes(".")) {
        alert("Invalid email address.")
        return false;
    } else {
        await fetch('https://roomio-room-builder.herokuapp.com/register', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            }),
        }).then(r => {
            if (r.status === 200) {
                window.location.assign('/home-notloggedin.html');
            }
        });
    }
}

async function login() {
    document.getElementById("signup-username").required = false;
    document.getElementById("signup-password").required = false;
    
    const username = document.getElementById("input-username").value;
    const password = document.getElementById("input-password").value;

    if (password.length <= 5) {
        alert("Password is not long enough.")
        return false;
    } else if (!username.includes("@") || !username.includes(".")) {
        alert("Invalid email address.")
        return false;
    } else {
        await fetch('https://roomio-room-builder.herokuapp.com/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            }),
        }).then(r => {
            if (r.status === 200) {
                window.location.assign('/home-loggedin.html');
            }
        });
    }
}