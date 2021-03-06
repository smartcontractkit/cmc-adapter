# Chainlink CoinMarketCap Pro External Adapter

**This adapter has moved to our [external adapters monorepo](https://github.com/smartcontractkit/external-adapters-js)!**

## Input Params

- `base`, `from`, `coin`, or `sym`: The coin to query (required)
- `quote`, `to`, `market`, or `convert`: The currency to convert to (required)
- `cid`: The CMC coin ID (optional, use in place of `sym` or `coin`)

## Output Format

```json
{
 "jobRunID": "1",
 "data": {
  "status": {
   "timestamp": "2020-04-13T20:52:42.250Z",
   "error_code": 0,
   "error_message": null,
   "elapsed": 9,
   "credit_count": 1,
   "notice": null
  },
  "data": {
   "ETH": {
    "id": 1027,
    "name": "Ethereum",
    "symbol": "ETH",
    "slug": "ethereum",
    "num_market_pairs": 5135,
    "date_added": "2015-08-07T00:00:00.000Z",
    "tags": [
     "mineable"
    ],
    "max_supply": null,
    "circulating_supply": 110505332.374,
    "total_supply": 110505332.374,
    "platform": null,
    "cmc_rank": 2,
    "last_updated": "2020-04-13T20:51:27.000Z",
    "quote": {
     "USD": {
      "price": 155.22087406,
      "volume_24h": 16301412264.6787,
      "percent_change_1h": 0.250983,
      "percent_change_24h": -5.25413,
      "percent_change_7d": -5.93502,
      "market_cap": 17152734279.383095,
      "last_updated": "2020-04-13T20:51:27.000Z"
     }
    }
   }
  },
  "result": 155.22087406
 },
 "result": 155.22087406,
 "statusCode": 200
}
```

## Install

```bash
yarn install
```

## Test

```bash
yarn test
```

## Create the zip

```bash
zip -r cl-cmc.zip .
```

## Docker

If you wish to use Docker to run the adapter, you can build the image by running the following command:

```bash
docker build . -t cmc-adapter
```

Then run it with:

```bash
docker run -it -p 8080:8080 -e API_KEY='YOUR_API_KEY' cmc-adapter:latest
```

## Install to AWS Lambda

- In Lambda Functions, create function
- On the Create function page:
  - Give the function a name
  - Use Node.js 12.x for the runtime
  - Choose an existing role or create a new one
  - Click Create Function
- Under Function code, select "Upload a .zip file" from the Code entry type drop-down
- Click Upload and select the `cl-cmc.zip` file
- Handler should remain index.handler
- Add the environment variable:
  - Key: API_KEY
  - Value: Your_API_key
- Save

## Install to GCP

- In Functions, create a new function, choose to ZIP upload
- Click Browse and select the `cl-cmc.zip` file
- Select a Storage Bucket to keep the zip in
- Function to execute: gcpservice
- Click More, Add variable
  - NAME: API_KEY
  - VALUE: Your_API_key
