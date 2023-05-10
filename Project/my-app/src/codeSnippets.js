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
`body {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
}

header {
    background-color: grey;
    padding: 10px;
    text-align: left;
    font-size: 16px;
    color: white;
    margin-bottom: 8px;
}

header h3 {
    margin: 0px;
}

footer {
    background-color: #f1f1f1;
    padding: 10px;
    text-align: center;
    color: green;
    margin-top: 8px;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }

footer p {
    margin: 0px;
}`;

function getCodeSnippet(taskName){
    switch (taskName){
        case "Setup the page":
            return setupThePage;
		case "Style the page":
			return styleThePage;
    }
}

export {
    getCodeSnippet
}
