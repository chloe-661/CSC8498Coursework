const setupThePage = 
`<!DOCTYPE ???>
<html>
	<head>
		<meta charset="UTF-8">
		<??? name="viewport" content="width=device-width, initial-scale=1">
		<title>Login Form</title>
		<link rel="stylesheet" href="styles.???">
	???
	<body>
		<header>
			???My Login Form Example</h3>
		</header>
	
		<div id???"loginForm">
			<!-- Content will go here -->
		</div>

		<footer>
			<p>WebDev???
		???
	</body>
	<script ???="text/javascript" src="login.js"></script>
</html>`;

const styleThePage = 
`bodie {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
}

header {
    background-color: grey;
    padding: 10;
    text-align: center;
    font-size: 16px;
    colour: white;
    margin-bottom: 8px;
	width: 100%
}

header h3 {
    margin: 0px;
}

footer {
    background-color: #f1f1f1;
    padding: 10px;
    text-align: right;
    color: grey;
    margin-top: 8px;
    position: relative;
    left: 0;
    bottom: 0;
    width: 50%;
  }

footer p {
    margin: 0px;
}`;

const SetuptheDatabase =
`/*You would enter these commands into an SQL editor or the command line*/

/*Creates a database if it doesn't already exist*/
CREATE ??? IF NOT ??? webDev DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

/*Shows you want to edit this database*/
USE ???;

/*Creates a new table called "users"*/
/*outlining the kind of data to be stored*/
/*and in what format the data will be, aka a number or a string*/
??? TABLE ??? NOT EXISTS ??? (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(50) NOT NULL,
  password ???(255) NOT NULL,
  PRIMARY ??? (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8???

/*Puts some data into the table*/
INSERT ??? users (???, ???, ???) 
VALUES 
    (1, 'John_Doe', 'testPassword'),
    (2, 'Jane_Doe', 'testPassword'),
    (3, 'CAPTAIN_Jack_Sparrow', 'rum')???
    (4, 'Than0s', 'snap'),
    ???5, 'JohnDow', 'test'),
    (6, 'JohnDow', 'test')????`

const BuildTheHTMLForm__1 =
`<form action="/action_page.php" method="post">
	<div class="imgcontainer">
		<img src="./images/avatar.png" alt="Avatar" class="avatar">
	</div>
	<div class="container">
		<label for="user"><b>Username</b></label>
		<input type="text" placeholder="Enter Username" name="user" required>

		<label for="pass"><b>Password</b></label>
		<input type="password" placeholder="Enter Password" name="pass" required>
			
		<button type="submit" id="login-form-submit" >Login</button>
		<label>
		<input type="checkbox" checked="checked" name="remember">
		Remember me
		</label>
	</div>
	<div id="loginForm__footer" class="container">
		<button type="button" class="cancelButton">Cancel</button>
		<span class="psw">Forgot <a href="#">password?</a></span>
	</div>
</form>`

const BuildTheHTMLForm__2 =
`<form action="/action_page.php" method="post">
<div class="imgcontainer">
<img src="./images/avatar.png" alt="Avatar" class="avatar">
</div>
<div class="container">
<label for="user"><b>Username</b></label>
<input type="text" placeholder="Enter Username" name="user" required>
<label for="pass"><b>Password</b></label>
<input type="password" placeholder="Enter Password" name="pass" required>		
<button type="submit" id="login-form-submit" >Login</button>
<label>
<input type="checkbox" checked="checked" name="remember">
Remember me
</label>
</div>
<div id="loginForm__footer" class="container">
<button type="button" class="cancelButton">Cancel</button>
<span class="psw">Forgot <a href="#">password?</a></span>
</div>
</form>`

const StyleTheHTMLForm = 
`#loginForm ???
    width: 100%;
}

form {
    ???: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 3px solid #f1f1f1;
    width: 25%;
    margin: auto;
}

input[type=text], input[type=password] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  ???: inline-block;
  ???: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  ???-color: green;
  border: 1px solid white;
  ???: white;
  padding: 14px 20px;
  margin: 8px 0;
  cursor: ???;
  width: 100%;
}

button:??? {
  opacity: 0.8;
  border: 1px dashed black;
}

.cancelbtn {
  width??? auto;
  padding: 10px 18px;
  background-color: red;
}

.imgcontainer {
  text-???: center;
  margin: 24px 0 12px 0;
}

img.avatar {
  width: 40%;
  border-radius: 50%;
}

.container {
  padding: 16px;
}

#loginForm__footer {
    background-color: #f1f1f1;
}

span.psw {
  float: right???
  padding-top: 16px;
}`

const Test6__1 = 
`<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Login Form</title>
		<link rel="stylesheet" href="styles.css">
	</head>
	<body>
		<header>
			<h3>My Login Form Example</h3>
		</header>
	
		<div id="loginForm">
			<!-- Content will go here -->
		</div>

		<footer>
			<p>WebDev</p>
		</footer>
	</body>
	<script type="text/javascript" src="login.js"></script>
</html>`;

const Test6__2 = 
`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Login Form</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<header>
<h3>My Login Form Example</h3>
</header>
<div id="loginForm">
<!-- Content will go here -->
</div>
<footer>
<p>WebDev</p>
</footer>
</body>
<script type="text/javascript" src="login.js"></script>
</html>`;

const PracticeBasicTags__1 = 
`<!DOCTYPE html>
<html>
	<head>
		<title> Page Title </title>
		<meta charset="">
		<meta name="" content="">
		<link rel="stylesheet" href="">
		<style> </style>
	</head>
	<body>
		<h1> Heading 1 </h1>
		<h2> Heading 2 </h2>
		<h3> Heading 3 </h3>
		<h4> Heading 4 </h4>
		<h5> Heading 5 </h5>
		<h6> Heading 6 </h6>
		<p> Paragraph </p>
		<a href=""> Link </a>
		<img src="" alt="">
		<ul>
			<li> item </li>
			<li> item </li>
			<li> item </li>
		</ul>
		<ol>
			<li> item </li>
			<li> item </li>
			<li> item </li>
		</ol>
		<script> </script>
	</body>
</html>`

const PracticeBasicTags__2 = 
`<!DOCTYPE html>
<html>
<head>
<title> Page Title </title>
<meta charset="">
<meta name="" content="">
<link rel="stylesheet" href="">
<style> </style>
</head>
<body>
<h1> Heading 1 </h1>
<h2> Heading 2 </h2>
<h3> Heading 3 </h3>
<h4> Heading 4 </h4>
<h5> Heading 5 </h5>
<h6> Heading 6 </h6>
<p> Paragraph </p>
<a href=""> Link </a>
<img src="" alt="">
<ul>
<li> item </li>
<li> item </li>
<li> item </li>
</ul>
<ol>
<li> item </li>
<li> item </li>
<li> item </li>
</ol>
<script> </script>
</body>
</html>`

const PracticeAttributes__1 = 
`<!DOCTYPE html>
<html>
	<head>
		<meta charset="">
		<meta name="" content="">
		<link rel="stylesheet" href="styles.css">
	</head>
	<body>
		<h1 id="title"> This has a unique ID attribute </h1>
		<h2 class="blueFont"> This has a class attribute</h2>
		<h3 class="blueFont"> This has the same class attribute, as classes can be used multiple times </h3>
		<h4 id="miniTitle" class="blueFont"> This has both an ID attribute and a class attribute </h4>
		<a href="www.google.com"> This has an attribute that includes a url to make a hyperlink </a>
		<p style="color:red;"> This has a style attribute that allows you to put CSS on the element </p>
		<img src="dog.jpg" alt="dog" width="500" height="600">
			<!-- the src attribute contains a url, the alt attribute describes the img in words, the width and height attribute set the size of the image -->
	</body>
</html>`

const PracticeAttributes__2 = 
`<!DOCTYPE html>
<html>
<head>
<meta charset="">
<meta name="" content="">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<h1 id="title"> This has a unique ID attribute </h1>
<h2 class="blueFont"> This has a class attribute</h2>
<h3 class="blueFont"> This has the same class attribute, as classes can be used multiple times </h3>
<h4 id="miniTitle" class="blueFont"> This has both an ID attribute and a class attribute </h4>
<a href="www.google.com"> This has an attribute that includes a url to make a hyperlink </a>
<p style="color:red;"> This has a style attribute that allows you to put CSS on the element </p>
<img src="dog.jpg" alt="dog" width="500" height="600">
<!-- the src attribute contains a url, the alt attribute describes the img in words, the width and height attribute set the size of the image -->
</body>
</html>`

const PracticeTables__1 = 
`<!DOCTYPE html>
<html>
	<head>
		<meta charset="">
		<meta name="" content="">
		<link rel="stylesheet" href="styles.css">
	</head>
	<body>
		<table>
			<tr>
				<th> Dogs </th>
				<th> Cats </th>
				<th> Fish </th>
			</tr>
			<tr>
				<td> Husky </td>
				<td> Persian </td>
				<td> ClownFish </td>
			</tr>
			<tr>
				<td> Pug </td>
				<td> Siamese </td>
				<td> Cod </td>
			</tr>
		</table>
	</body>
</html>`

const PracticeTables__2 = 
`<!DOCTYPE html>
<html>
<head>
<meta charset="">
<meta name="" content="">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<table>
<tr>
<th> Dogs </th>
<th> Cats </th>
<th> Fish </th>
</tr>
<tr>
<td> Husky </td>
<td> Persian </td>
<td> ClownFish </td>
</tr>
<tr>
<td> Pug </td>
<td> Siamese </td>
<td> Cod </td>
</tr>
</table>
</body>
</html>`

const PracticeFonts__1 = 
`body {
	font-family: "Times New Roman", Times, serif;
}	
h1 {
	color: green;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 200%;
	font-weight: bolder;
	text-align: center;
	text-decoration: overline underline;
}
h2 {
	color: red;
	font-size: large;
	font-weight: bold;
	font-style: italic;
	text-align: left;
	text-decoration: line-through;
}
h3 {
	color: blue;
	font-size: 1rem;
	font-weight: normal
	font-style: oblique;
	text-align: right;
	text-decoration: overline;
}
p {
	color: black;
	font-size: 11px;
	font-weight: lighter
	text-align: left;
}
a {
	color: black;
	font-size: 11px;
	font-weight: 600
	text-align: left;
	text-decoration: underline;
}`

const PracticeFonts__2 = 
`body {
font-family: "Times New Roman", Times, serif;
}
h1 {
color: green;
font-family: Arial, Helvetica, sans-serif;
font-size: 200%;
font-weight: bolder;
text-align: center;
text-decoration: overline underline;
}
h2 {
color: red;
font-size: large;
font-weight: bold;
font-style: italic;
text-align: left;
text-decoration: line-through;
}
h3 {
color: blue;
font-size: 1rem;
font-weight: normal
font-style: oblique;
text-align: right;
text-decoration: overline;
}
p {
color: black;
font-size: 11px;
font-weight: lighter
text-align: left;
}
a {
color: black;
font-size: 11px;
font-weight: 600
text-align: left;
text-decoration: underline;
}`

const PracticePaddingMargin__1 = 
`h1 {
	margin: 100px;
	padding: 200px;
}
h2 {
	margin: auto;
}
h3 {
	margin: 50%;
	padding: 75%;
}
h4 {
	margin: 1rem;
	padding: 1em;
}
div {
	margin-top: 100px;
	margin-bottom: 40px;
	margin-right: 150px;
	margin-left: 80px;
	padding-top: 100px;
	padding-bottom: 40px;
	padding-right: 150px;
	padding-left: 80px;
}
p {
	margin: 100px 150px 40px 80px;
	padding: 100px 150px 40px 80px;
}
.container {
	margin-top: 100px;
	margin-bottom: 100px;
	margin-right: 80px;
	margin-left: 80px;
	padding-top: 100px;
	padding-bottom: 100px;
	padding-right: 80px;
	padding-left: 80px;
}
.container p {
	margin: 100px 80px;
	padding: 100px 80px;
}`

const PracticePaddingMargin__2 = 
`h1 {
margin: 100px;
padding: 200px;
}
h2 {
margin: auto;
}
h3 {
margin: 50%;
padding: 75%;
}
h4 {
margin: 1rem;
padding: 1em;
}
div {
margin-top: 100px;
margin-bottom: 40px;
margin-right: 150px;
margin-left: 80px;
padding-top: 100px;
padding-bottom: 40px;
padding-right: 150px;
padding-left: 80px;
}
p {
margin: 100px 150px 40px 80px;
padding: 100px 150px 40px 80px;
}
.container {
margin-top: 100px;
margin-bottom: 100px;
margin-right: 80px;
margin-left: 80px;
padding-top: 100px;
padding-bottom: 100px;
padding-right: 80px;
padding-left: 80px;
}
.container p {
margin: 100px 80px;
padding: 100px 80px;
}`

const PracticeLoops__1 =
`// For Loop
for (let i = 0; i < 5; i++) {
	let multiplesOfTwo = 2 * i;
	console.log(multiplesOfTwo);
}
// For-in Loop with an array
const numbers = [45, 4, 9, 16, 25];
for (let n in numbers) {
	let cummulative = cummulative + numbers[n];
	console.log(cummulative);
}
// For-in Loop with a object
const person = {firstName:"Jane", lastName:"Doe", age:18};
let text = "";
for (let p in person) {
	text = text + person[p];
}
console.log(text)
// While Loop
const max = 100;
let i = 0;
while (i < max){
	console.log(i)
	i++
}
// Do While Loop
const maximum = 50;
let j = 0;
do {
	j = j * 10;
}
while (j < maximum);`

const PracticeLoops__2 =
`// For Loop
for (let i = 0; i < 5; i++) {
let multiplesOfTwo = 2 * i;
console.log(multiplesOfTwo);
}
// For-in Loop with an array
const numbers = [45, 4, 9, 16, 25];
for (let n in numbers) {
let cummulative = cummulative + numbers[n];
console.log(cummulative);
}
// For-in Loop with a object
const person = {firstName:"Jane", lastName:"Doe", age:18};
let text = "";
for (let p in person) {
text = text + person[p];
}
console.log(text)
// While Loop
const max = 100;
let i = 0;
while (i < max){
console.log(i)
i++
}
// Do While Loop
const maximum = 50;
let j = 0;
do {
j = j * 10;
}
while (j < maximum);`

const PracticeGettingDOMElements =
`// Get elements from the DOM
document.getElementById("id");
document.getElementsByTagName("h1");
document.getElementsByClassName("name");
// Change elements from the DOM
document.getElementById("id").innerHTML = newHtmlContent;
document.getElementsByTagName("h1").attribute = newValue;
document.getElementsByClassName("name").style.property = newStyle;
document.getElementById("id").setAttribute(attribute, value);
// Add or Remove elements from the DOM
document.createElement(element);
document.removeChild(element);
document.appendChild(element);
document.replaceChild(new, old);
document.write(text);
// Combining them
// Getting all elements with the id="unique"
// Then finding all <p> elements within "unique"
const x = document.getElementById("unique");
const y = x.getElementsByTagName("p");`

const PracticeDataRetrieval =
`SELECT * FROM Users;
SELECT firstName, lastName FROM Users;
SELECT firstName, lastName FROM Users WHERE city='London';
SELECT * FROM Users WHERE age BETWEEN 18 AND 30;
SELECT * FROM Users WHERE country NOT 'UK';
SELECT * FROM Users WHERE country='UK' OR 'USA';
SELECT * FROM Users WHERE country='UK' AND city='London;
SELECT * FROM Users ORDER BY age;
SELECT * FROM Users ORDER BY age ASC;
SELECT * FROM Users ORDER BY age DESC;
SELECT * FROM Users ORDER BY age ASC, lastName DESC;`

const ConnectToTheDatabase__1 = 
`// This login form is using Express and MySQL to talk to a database
// Config Modules
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
// Database connection config
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'users' //Name of the database
});
// Express Modules
const app = express();
app.use(session({
	secret: 'secret', // Replace this
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
// Logs whether the connection to the database was successful or not to the console
connection.connect((error) => {
    if(error) {
        console.log(error);
    } else {
        console.log("MySQL connected!");
    }
});
// ---
// Data Retrieval Requests will go here
// ---
// States which ports should be listened to
app.listen(3000, ()=> {
    console.log("server started on port 3000");
});`

const ConnectToTheDatabase__2 = 
`// This login form is using Express and MySQL to talk to a database
// Config Modules
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
// Database connection config
const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'users' //Name of the database
});
// Express Modules
const app = express();
app.use(session({
secret: 'secret', // Replace this
resave: true,
saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
// Logs whether the connection to the database was successful or not to the console
connection.connect((error) => {
if(error) {
console.log(error);
} else {
console.log("MySQL connected!");
}
});
// ---
// Data Retrieval Requests will go here
// ---
// States which ports should be listened to
app.listen(3000, ()=> {
console.log("server started on port 3000");
});`

const GetDataFromTheDatabase =
`// Render login template to the screen
// http://localhost:3000/
app.get('/', function(request, ???) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

// Get data from the database
// http://localhost:3000/auth
???.post('/???', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (??? && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], 
            function(error, results, fields) {
                // If there is an issue with the query, output the error
                ??? (error) throw error;
                // If the account exists
                if (results.length > 0) {
                    // Authenticate the user
                    ???.session.loggedin = true;
                    request.session.username = ???;
                    // Redirect to home page
                    response.???('/home');
                } else {
                    response.send('Incorrect Username and/or Password!');
                }			
                response.end();
		    }
        );
	} else {
		response.???('Please enter Username and Password!');
		response.???();
	}
});

// Render login template to the screen with updated values
// http://localhost:3000/home
app.???('/home', function(request, response) {
	// If the user is loggedin
	if (request.???.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

// States which ports should be listened to
app.listen(3000, ()=> {
    console.log("server started on port 3000")
})`



function getCodeSnippet(taskName){
    switch (taskName){
        case "Setup the page":
            return setupThePage;
		case "Style the page":
			return styleThePage;
		case "Style the HTML Form":
			return StyleTheHTMLForm;
		case "Test6__1":
			return Test6__1;	
		case "Test6__2":
			return Test6__2;
		case "*Practice: Basic Tags__1":
			return PracticeBasicTags__1;	
		case "*Practice: Basic Tags__2":
			return PracticeBasicTags__2;
		case "*Practice: Attributes__1":
			return PracticeAttributes__1;	
		case "*Practice: Attributes__2":
			return PracticeAttributes__2;
		case "*Practice: Tables__1":
			return PracticeTables__1;	
		case "*Practice: Tables__2":
			return PracticeTables__2;
		case "*Practice: Fonts__1":
			return PracticeFonts__1;	
		case "*Practice: Fonts__2":
			return PracticeFonts__2;
		case "*Practice: Padding and Margins__1":
			return PracticePaddingMargin__1;	
		case "*Practice: Padding and Margins__2":
			return PracticePaddingMargin__2;
		case "*Practice: Loops__1":
			return PracticeLoops__1;	
		case "*Practice: Loops__2":
			return PracticeLoops__2;
		case "*Practice: Getting DOM Elements__1":
			return PracticeGettingDOMElements;	
		case "*Practice: Getting DOM Elements__2":
			return PracticeGettingDOMElements;
		case "*Practice: Data Retrieval__1":
			return PracticeDataRetrieval;	
		case "*Practice: Data Retrieval__2":
			return PracticeDataRetrieval;
		case "Build the HTML Form__1":
			return BuildTheHTMLForm__1;	
		case "Build the HTML Form____2":
			return BuildTheHTMLForm__2;
		case "Setup the Database":
			return SetuptheDatabase;
		case "Connect to the Database__1":
			return ConnectToTheDatabase__1;	
		case "Connect to the Database__2":
			return ConnectToTheDatabase__2;
		case "Get Data from the Database":
			return GetDataFromTheDatabase;
    }
}

export {
    getCodeSnippet
}
