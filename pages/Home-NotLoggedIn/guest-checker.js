
// const logo_thing = document.getElementById("logo");

document.getElementById("button-guest-button").addEventListener("click", ()=>{
    window.localStorage.setItem("login", "guest");
});

document.getElementById("logo").addEventListener("click", ()=>{
    if (window.localStorage.getItem("login") === "guest"){
        document.write("<a href = \"../Home-NotLoggedIn/home-notloggedin.html\" >");
        // window.location.href("../Home-NotLoggedIn/home-notloggedin.html");
    } else {
        document.write("<a href = \"../Home-LoggedIn/home-notloggedin.html\" >");
        // window.location.href("../Home-LoggedIn/home-notloggedin.html");
    }
})


