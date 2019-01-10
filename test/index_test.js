const assert = require('chai').assert;
const createRequest = require('../index.js').createRequest;


describe('createRequest', () => {
  context('single sym, single convert', () => {
    const jobID = "278c97ffadb54a5bbb93cfec5f7b5503";
	const req = {
		id: jobID,
		data: {
			sym: "ETH",
    		convert: "USD"
		}
	};

	it('returns data to the node', (done) => {
		createRequest(req, (statusCode, data) => {
			assert.equal(statusCode, 200);
			assert.equal(data.jobRunID, jobID);
			assert.isNotEmpty(data.data);
			done();
			});
		});
	});

	context('single sym, multi convert', () => {
		const jobID = "278c97ffadb54a5bbb93cfec5f7b5504";
		const req = {
			id: jobID,
			data: {
				sym: "ETH",
				convert: "USD,EUR"
			}
		};
	
		it('returns data to the node', (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				assert.isNotEmpty(data.data);
				done();
			});
		});
	});

	context('multi sym, single convert', () => {
		const jobID = "278c97ffadb54a5bbb93cfec5f7b5504";
		const req = {
			id: jobID,
			data: {
				sym: "BTC,ETH",
				convert: "USD"
			}
		};
	
		it('returns data to the node', (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				assert.isNotEmpty(data.data);
				done();
			});
		});
	});

	context('multi sym, multi convert', () => {
		const jobID = "278c97ffadb54a5bbb93cfec5f7b5506";
		const req = {
			id: jobID,
			data: {
				sym: "BTC,ETH",
				convert: "USD,EUR"
			}
		};
	
		it('returns data to the node', (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				assert.isNotEmpty(data.data);
				done();
			});
		});
	});
});