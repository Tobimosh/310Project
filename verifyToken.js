const jwt = require("jsonwebtoken");


function verfiyToken(req, res, next) {
	const token = req.cookies.authToken;
	if (!token) return res.status(401).send("Access Denied");

	try {
		const verified = jwt.verify(token, 'moshood');
		// console.log(verified);
		req.user = verified;
		next();
	} catch (error) {
		res.status(400).send("Invalid Token");
	}
}

module.exports = verfiyToken;
