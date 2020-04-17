const { Requester, Validator } = require('external-adapter')

const customParams = {
  symbol: ['base', 'from', 'coin', 'sym', 'symbol'],
  convert: ['quote', 'to', 'market', 'convert'],
  cid: false
}

const createRequest = (input, callback) => {
  const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
  const validator = new Validator(input, customParams, callback)
  const jobRunID = validator.validated.id
  const symbol = validator.validated.data.symbol
  // CMC allows a coin ID to be specified instead of a symbol
  const cid = validator.validated.data.cid || ''
  // Free CMCPro API only supports a single symbol to convert
  const convert = validator.validated.data.convert
  let qs
  if (symbol.length > 0) {
    qs = {
      symbol,
      convert
    }
  } else {
    qs = {
      id: cid,
      convert
    }
  }
  const options = {
    url,
    headers: {
      'X-CMC_PRO_API_KEY': process.env.API_KEY
    },
    qs
  }
  Requester.requestRetry(options)
    .then(response => {
      response.body.result = Requester.validateResult(response.body, ['data', symbol, 'quote', convert, 'price'])
      callback(response.statusCode, Requester.success(jobRunID, response))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

module.exports.createRequest = createRequest
