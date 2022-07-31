const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const ccxt = require('ccxt');
const morgan = require('morgan');
const exchange = new ccxt.huobi();

const app = express();
const port = 7090;
expressWs(app);

app.use(morgan());
app.use(cors());
app.use(express.static('../front-app/dist'));

app.get('/exchanges', function (req, res) {
    res.send(ccxt.exchanges);
});

app.get('/markets', async function (req, res) {
    let markets = await exchange.loadMarkets();
    res.send(markets);
});

app.get('/tickers', async function (req, res) {
    let tickers = await exchange.fetchTickers();
    let tickerList = Object.keys(tickers).map(
        k => {
            let item = tickers[k];
            delete item.info;
            return item
        }
    );

    res.send(tickerList);
});

app.get('/olhv', async function (req, res) {
    const {
        symbol, timeframe, since, limit
    } = req.query;
    console.log(req.query)
    try {
        let ohlcvData = await exchange.fetchOHLCV(
            symbol, timeframe, since, limit
        )
        res.send(ohlcvData);
    } catch (error) {
        console.error(error);
    }
});

app.ws('/', async function (ws, req) {
    ws.on('message', function (msg) { console.log(msg) });
    exchange.load
    ws.send();
});

app.listen(port, () => { });