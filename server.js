const express = require('express');
const { default: apiRouter } = require('./routes');


const port = process.env.PORT || 5000

const app = express();

apiRouter(app)

app.listen(port, () => {
    console.log(`Listing on port ${port}`)
})