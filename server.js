const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function openPosition({symbol, side, quantity, entryPrice, stopLoss}) {
  const apiKey = process.env.TRADING212_API_KEY;
  const accountId = process.env.TRADING212_ACCOUNT_ID;
  if (!apiKey || !accountId) {
    console.error('Missing TRADING212_API_KEY or TRADING212_ACCOUNT_ID environment variables');
    return;
  }

  const slDifference = Math.abs(entryPrice - stopLoss);
  const takeProfit = side === 'buy'
    ? entryPrice + slDifference * 2
    : entryPrice - slDifference * 2;

  const payload = {
    instrument: symbol,
    side: side,
    quantity: quantity,
    entryPrice: entryPrice,
    stopLoss: stopLoss,
    takeProfit: takeProfit
  };

  try {
    await axios.post('https://api.trading212.com/order', payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Account-Id': accountId,
        'Content-Type': 'application/json'
      }
    });
    console.log('Order placed:', payload);
  } catch (err) {
    console.error('Failed to place order:', err.message);
  }
}

app.post('/webhook', async (req, res) => {
  const { symbol, side, quantity, entryPrice, stopLoss } = req.body;
  if (!symbol || !side || !quantity || !entryPrice || !stopLoss) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }
  await openPosition({symbol, side, quantity, entryPrice, stopLoss});
  res.json({ status: 'Order processed' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
