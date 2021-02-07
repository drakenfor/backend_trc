const express = require('express')
const app = express();

app.use('/login', require('./auth.routes'));
app.use('/gas', require('./gas.routes'))
app.use('/ticket', require('./ticket.routes'));
app.use('/users',require('./users.routes'));

module.exports = app;