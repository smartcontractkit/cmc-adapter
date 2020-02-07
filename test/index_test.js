const assert = require('chai').assert
const createRequest = require('../index.js').createRequest


describe('createRequest', () => {
  context('requesting sym and convert', () => {
    const jobID = '278c97ffadb54a5bbb93cfec5f7b5503'
    const req = {
      id: jobID,
      data: {
        sym: 'ETH',
        convert: 'USD'
      }
    }

    it('returns data to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 200)
        assert.equal(data.jobRunID, jobID)
        assert.isNotEmpty(data.data)
        assert.isNumber(data.data.result)
        assert.isNumber(data.result)
        done()
      })
    })
  })

  context('requesting coin and market', () => {
    const jobID = '278c97ffadb54a5bbb93cfec5f7b5506'
    const req = {
      id: jobID,
      data: {
        coin: 'ETH',
        market: 'USD'
      }
    }

    it('returns data to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 200)
        assert.equal(data.jobRunID, jobID)
        assert.isNotEmpty(data.data)
        assert.isNumber(data.data.result)
        assert.isNumber(data.result)
        done()
      })
    })
  })

  context('with a bad request', () => {
    const jobID = '278c97ffadb54a5bbb93cfec5f7b5506'
    const req = {
      id: jobID,
      data: {
        coin: 'notreal',
        market: 'notreal'
      }
    }

    it('returns an error to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.isAtLeast(statusCode, 400)
        assert.equal(data.jobRunID, jobID)
        assert.isNotEmpty(data.error)
        done()
      })
    })
  })
})
