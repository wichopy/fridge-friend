//Following these RESTful user sessions and creation routes.

http://stackoverflow.com/questions/7140074/restfully-design-login-or-register-resources

GET    /session/new gets the webpage that has the login form
POST   /session authenticates credentials against database
DELETE /session destroys session and redirect to /
GET  /users/new gets the webpage that has the registration form
POST /users records the entered information into database as a new /user/xxx


To test:

Logout request: curl -X DELETE -d id=1 -d _method=DELETE  http://localhost:8080/session/

