function openForm() {
    document.getElementById("myForm").style.display = "block";
    window.scrollTo(0, document.body.scrollHeight);
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

async function signUp() {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    await fetch('http://localhost:3000/register', {
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

async function validUser() {
    const username = document.getElementById("input-username").value;
    const password = document.getElementById("input-password").value;

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