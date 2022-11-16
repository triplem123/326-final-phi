const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/html/home-notloggedin.html');
});

router.get('/*.html', (req, res) => {
    // express.static(__dirname + req.url);
    res.sendFile(__dirname + '/pages/html' + req.url);
});

router.get('/*.css', (req, res) => {
    // express.static(__dirname + req.url);
    res.sendFile(__dirname + '/pages/css' + req.url);
});

router.get('/*.js', (req, res) => {
    // express.static(__dirname + req.url);
    res.sendFile(__dirname + '/pages/js' + req.url);
});

router.get('/assets/furniture-images/*', (req, res) => {
    // express.static(__dirname + req.url);
    res.sendFile(__dirname + req.url);
});


module.exports = router;











// router.get('/home-loggedin.html', (req, res) => {
//     res.sendFile(__dirname + '/pages/html/home-loggedin.html');
// });

// router.get('/guest-room-builder.html', (req, res) => {
//     res.sendFile(__dirname + '/pages/html/guest-room-builder.html');
// });

// router.get('/my-rooms.html', (req, res) => {
//     res.sendFile(__dirname + '/pages/html/my-rooms.html');
// });

// router.get('/profile.html', (req, res) => {
//     res.sendFile(__dirname + '/pages/html/profile.html');
// });

// router.get('/room-builder.html', (req, res) => {
//     res.sendFile(__dirname + '/pages/html/room-builder.html');
// });

// router.get('/home-notloggedin.css', (req, res) => {
//     res.sendFile(__dirname + '/pages/css/home-notloggedin.css');
// });

// router.get('/home-loggedin.css', (req, res) => {
//     res.sendFile(__dirname + '/pages/css/home-loggedin.css');
// });

// router.get('/guest-room-builder.css', (req, res) => {
//     res.sendFile(__dirname + '/pages/css/guest-room-builder.css');
// });

// router.get('/my-rooms.css', (req, res) => {
//     res.sendFile(__dirname + '/pages/css/my-rooms.css');
// });

// router.get('/profile.css', (req, res) => {
//     res.sendFile(__dirname + '/pages/css/profile.css');
// });

// router.get('/room-builder.css', (req, res) => {
//     res.sendFile(__dirname + '/pages/css/room-builder.css');
// });

// router.get('/builder-components.js', (req, res) => {
//     res.sendFile(__dirname + '/pages/js/builder-components.js');
// });

// router.get('/guest-builder-components.js', (req, res) => {
//     res.sendFile(__dirname + '/pages/js/guest-builder-components.js');
// });

// router.get('/guest-room-builder.js', (req, res) => {
//     res.sendFile(__dirname + '/pages/js/guest-room-builder.js');
// });

// router.get('/my-rooms.js', (req, res) => {
//     res.sendFile(__dirname + '/pages/js/my-rooms.js');
// });

// router.get('/profile.js', (req, res) => {
//     res.sendFile(__dirname + '/pages/js/profile.js');
// });

// router.get('/room-builder.js', (req, res) => {
//     res.sendFile(__dirname + '/pages/js/room-builder.js');
// });

// router.get('/signup-popup.js', (req, res) => {
//     res.sendFile(__dirname + '/pages/js/signup-popup.js');
// });

// router.get('/server_demo.js', (req, res) => {
//     res.sendFile(__dirname + '/server/server_demo.js');
// });

// router.get('/database.js', (req, res) => {
//     res.sendFile(__dirname + '/server/database.js');
// });