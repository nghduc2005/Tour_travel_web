const express = require('express');
const path = require('path')
require('dotenv').config()
const database = require('./config/database.config')
const variableConfig = require('./config/variable.config')
const clientRoutes =require('./routes/client/index.route')
const adminRoutes = require('./routes/admin/index.route')
const app = express();

const port = process.env.PORT;

database.connect();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())

app.locals.pathAdmin = variableConfig.pathAdmin

global.pathAdmin = variableConfig.pathAdmin

app.use('/', clientRoutes)
app.use(`/${pathAdmin}`, adminRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})