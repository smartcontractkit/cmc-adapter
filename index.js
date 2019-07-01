let request = require('request');

const createRequest = (input, callback) => {
	const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
	const sym = input.data.sym || input.data.coin || "";
	const cid = input.data.cid || ""; // CMC allows a coin ID to be specified instead of a symbol
	// Free CMCPro API only supports a single symbol to convert
	let convert = input.data.convert || input.data.market || "";
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
	};
	let options = {
		url: url,
		headers: headerObj,
		qs: requestObj,
		json: true
	};
	request(options, (error, response, body) => {
		if (error || response.statusCode >= 400) {
			callback(response.statusCode, {
				jobRunID: input.id,
				status: "errored",
				error: body,
				errorMessage: body.status.error_message,
				statusCode: response.statusCode
			});
		} else {
			callback(response.statusCode, {
				jobRunID: input.id,
				data: body,
				// Only return the price of the first symbol if multiple are specified
				result: body.data[sym].quote[convert].price,
				statusCode: response.statusCode
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
};

exports.handlerv2 = (event, context, callback) => {
	createRequest(JSON.parse(event.body), (statusCode, data) => {
		callback(null, {
			statusCode: statusCode,
			body: JSON.stringify(data),
			isBase64Encoded: false
		});
	});
};

module.exports.createRequest = createRequest;