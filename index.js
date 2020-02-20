const rp = require('request-promise')
const retries = process.env.RETRIES || 3
const delay = process.env.RETRY_DELAY || 1000
const timeout = process.env.TIMEOUT || 1000

const requestRetry = (options, retries) => {
  return new Promise((resolve, reject) => {
    const retry = (options, n) => {
      return rp(options)
        .then(response => {
          if (response.body.error) {
            if (n === 1) {
              reject(response)
            } else {
              setTimeout(() => {
                retries--
                retry(options, retries)
              }, delay)
            }
          } else {
            return resolve(response)
          }
        })
        .catch(error => {
          if (n === 1) {
            reject(error)
          } else {
            setTimeout(() => {
              retries--
              retry(options, retries)
            }, delay)
          }
        })
    }
    return retry(options, retries)
  })
}

const createRequest = (input, callback) => {
  const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
  const sym = input.data.sym || input.data.from || input.data.coin || ''
  const cid = input.data.cid || '' // CMC allows a coin ID to be specified instead of a symbol
  // Free CMCPro API only supports a single symbol to convert
  let convert = input.data.convert || input.data.to || input.data.market || ''
  let requestObj
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
    'X-CMC_PRO_API_KEY': process.env.API_KEY
  }
  let options = {
    url: url,
    headers: headerObj,
    qs: requestObj,
    json: true,
    timeout,
    resolveWithFullResponse: true
  }
  requestRetry(options, retries)
    .then(response => {
      const result = response.body.data[sym].quote[convert].price
      response.body.result = result
      callback(response.statusCode, {
        jobRunID: input.id,
        data: response.body,
        result,
        statusCode: response.statusCode
      })
    })
    .catch(error => {
      callback(error.statusCode, {
        jobRunID: input.id,
        status: 'errored',
        error,
        statusCode: error.statusCode
      })
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
