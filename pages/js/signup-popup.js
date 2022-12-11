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

    if (username.length <= 1 || password.length <= 1) {
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
        });
    }
}

async function validUser() {
    document.getElementById("signup-username").required = false;
    document.getElementById("signup-password").required = false;
    
    const username = document.getElementById("input-username").value;
    const password = document.getElementById("input-password").value;

    if (username.length <= 1 || password.length <= 1) {
        return false;
    } else {
        await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            }),
        });
    }
}