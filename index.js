const express = require('express');
const path = require('path')
const clientRoutes =require('./routes/client/index.route')
const app = express();

const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', clientRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})