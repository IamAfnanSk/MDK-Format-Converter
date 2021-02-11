const express = require('express');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const hooks = require('./routes/hooks');
const forms = require('./routes/forms');

const app = express();

require('dotenv').config();

app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', index);
app.use('/hooks', hooks);
app.use('/forms', forms);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
