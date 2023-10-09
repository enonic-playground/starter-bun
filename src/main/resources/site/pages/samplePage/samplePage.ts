export function get({headers}) {
	log.info('headers:%s', JSON.stringify(headers, null, 4));
	return {
		body: `<html>
	<head>
		<title>Title</title>
	</head>
	<body>
		<h1>H1</h1>
	</body>
</html>`
	}
}
