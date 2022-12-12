TEAMP NAME: TEAM PHI
APPLICATION NAME: ROOMIO
SEMESTER: FALL 2022
OVERVIEW: Roomio is a web application that helps users figure out the best layout for their homes when renovating or moving into a new place. The user can create an exact replica of the shape of their room and add different types of furniture and adjust it to size to create a floor plan. Our application is innovative because it aso allows users to add the places where the electrical outlets are that allow them to keep that in mind when placing their electronics like TVs, monitors, etc. 
TEAM MEMBERS: MAC BARLOW, ARYUN GUPTA, AFSAANA BHATT
USER INTERFACE: 
    home page for non logged in users. 

   Room builder for non logged-in users: 

My rooms page for logged-in users: allows users to create new rooms, save, delete, or share rooms.

Room builder for logged-in users:  allows users to create their room layout and add furniture


APIs:
	Users: POST to create a user (body includes email, username, password, and the room corner layout points), GET to read user (get the user with the matching ID and return that user object), PUT to update user (to update email, username, password, new room layout), DEL to delete user (remove the user from our database including all their information that was saved).

DATABASE:
User_Data document: { userhash: String // Hash assigned to a given user Email: String // Stores the user's email address Password: String // Stores the user's password Rooms_Created: Number // Stores the number of rooms that the user has rooms: Array[] { room: { // Array of room objects that store information about each room setup roomName: String // Stores the name of the room corners: String // Stores the outline of the room furniture: String // Stores the furniture in the room } } }

URL Routes/Mapping:
/ : home page
/login : user logged in home page
/logout : user not logged in home page
/register : sign up pop up home page
/private/:userID/ : verify that this is a real user (authenticate it). Routes to that specific user’s home logged in page.

AUTHENTICATION:
In roomio we used passport.js to authenticate users and to log them into their home pages too. Logging in is done through a username and password. Passport takes care of this. Then only allows authenticated users to access the logged in home page and my rooms page. If user isn’t authenticated they are redirected back to the root logged in home page to retry logging in, and then the same authentication process will take place.

DIVISION OF LABOR: 
Aryun Gupta: created home page UI, helped with routing, helped with front end javascript, helped with backend javascript, did milestone 3, helped set up mongoDB, helped with profile page.
Afsaana Bhatt: helped in creating room builder page, helped with authentication, helped with front end javascript, did milestone 1, helped create database for mongoDB, helped with profile page
Mac Barlow: helped in creating room builder page, helped with authentication, helped with front end javascript, helped with backend javascript, did milestone 2, connected mongoDB to heroku with help creating database, 
