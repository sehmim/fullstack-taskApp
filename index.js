const express = require('express');
const volleyball = require('volleyball');

const app = express();

const auth = require('./auth/index')

app.use(volleyball);

app.use(express.json());

app.get('/', (req,res)=>{
    res.json({
        message: "Hello Yo mama"
    })
})


// Prepended with auth
app.use('/auth', auth)

function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error)
}

function errorHandler(req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message : err.message,
        stack : err.stack
    })
}

app.use(notFound);
app.use(errorHandler);


const port = process.env.PORT || 5000;

app.listen( port, () => {
    console.log("Listening on Port ", port);
})