# TradingView Webhook to Trading212

This simple Node.js app uses Express to receive webhooks from TradingView and places corresponding orders through the Trading212 API. Stop loss and take profit are set with a 1:2 ratio.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables for your Trading212 account:
   - `TRADING212_API_KEY` – your API key
   - `TRADING212_ACCOUNT_ID` – account identifier
   - `PORT` (optional) – port for the server (default `3000`)
3. Run the server:
   ```bash
   node server.js
   ```

## Webhook

Send a POST request to `/webhook` with JSON body containing:

```json
{
  "symbol": "AAPL",
  "side": "buy",
  "quantity": 1,
  "entryPrice": 100.0,
  "stopLoss": 99.0
}
```

Take profit will automatically be calculated at a distance twice the difference between `entryPrice` and `stopLoss`.
