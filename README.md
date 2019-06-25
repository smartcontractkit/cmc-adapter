# Chainlink CoinMarketCap Pro External Adapter

## Input Params

- `sym` or `coin`: The coin to query (required)
- `convert` or `market`: The currency to convert to (required)
- `cid`: The CMC coin ID (optional, use in place of `sym` or `coin`)

## Output Format

```json
{
	"status": {
		"timestamp": "2019-06-25T19:43:00.439Z",
		"error_code": 0,
		"error_message": null,
		"elapsed": 82,
		"credit_count": 1
	},
	"data": {
		"ETH": {
			"id": 1027,
			"name": "Ethereum",
			"symbol": "ETH",
			"slug": "ethereum",
			"circulating_supply": 106639848.8741,
			"total_supply": 106639848.8741,
			"max_supply": null,
			"date_added": "2015-08-07T00:00:00.000Z",
			"num_market_pairs": 5396,
			"tags": [
				"mineable"
			],
			"platform": null,
			"cmc_rank": 2,
			"last_updated": "2019-06-25T19:42:20.000Z",
			"quote": {
				"USD": {
					"price": 309.561674348,
					"volume_24h": 8982952362.30919,
					"percent_change_1h": -0.241257,
					"percent_change_24h": 0.246267,
					"percent_change_7d": 16.4321,
					"market_cap": 33011610169.68408,
					"last_updated": "2019-06-25T19:42:20.000Z"
				}
			}
		}
	}
}
```

## Install

```bash
npm install
```

## Test

```bash
npm test
```

## Create the zip

```bash
zip -r cl-cmc.zip .
```

## Install to AWS Lambda

- In Lambda Functions, create function
- On the Create function page:
  - Give the function a name
  - Use Node.js 8.10 for the runtime
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