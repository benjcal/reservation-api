import app from "./app";

const start = (port: Number | String) => {
	try {
		app.listen(port, () => {
			console.log(`Api running at http://localhost:${port}`);
		});
	} catch (err) {
		console.error(err);
		process.exit();
	}
};

const port = process.env.PORT || 3000;
start(port);
