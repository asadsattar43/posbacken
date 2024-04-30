const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use('/api', routes);

app.listen(5013, () => {
  console.log('Server listening on port 5013');
});