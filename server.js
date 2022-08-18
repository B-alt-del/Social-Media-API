const express = require('express');
const db = require('./config/connection')
const api_routes = require('./routes/api_routes')

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use('/api', api_routes);

db.once('open', () => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`))
});