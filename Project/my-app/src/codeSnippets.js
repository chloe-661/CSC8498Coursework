const setupThePage = 
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

function getCodeSnippet(taskName){
    switch (taskName){
        case "Setup the page":
            return setupThePage;
		case "Style the page":
			return styleThePage;
		case "Test6__1":
			return Test6__1;	
		case "Test6__2":
			return Test6__2;
    }
}

export {
    getCodeSnippet
}
