let request = require('request');

const createRequest = (input, callback) => {
	const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
	const sym = input.data.sym || "";
	const cid = input.data.cid || "";
	// Free CMCPro API only supports a single symbol to convert
	const convert = input.data.convert.substring(0,3) || "";
	let requestObj;
	if (sym.length > 0) {
		requestObj = {
			symbol: sym,
			convert: convert
		}
	} else {
		requestObj = {
			id: cid,
			convert: convert
		}
	}
	let headerObj = {
		"X-CMC_PRO_API_KEY": process.env.API_KEY
	}
	let options = {
		url: url,
		headers: headerObj,
		qs: requestObj,
		json: true
	}
	request(options, (error, response, body) => {
		if (error || response.statusCode >= 400) {
			callback(response.statusCode, {
				jobRunID: input.id,
				status: "errored",
				error: body
			});
		} else {
			callback(response.statusCode, {
				jobRunID: input.id,
				data: body
			});
		}
	});
};

exports.gcpservice = (req, res) => {
	createRequest(req.body, (statusCode, data) => {
		res.status(statusCode).send(data);
	});
};

exports.handler = (event, context, callback) => {
	createRequest(event, (statusCode, data) => {
		callback(null, data);
	});
}

module.exports.createRequest = createRequest;