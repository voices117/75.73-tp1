const express = require('express');

const PORT = 3000;
const app = express();

app.get('/', (req, res) => {
  res.status(200).send("node - ping\n");
});

app.get('/timeout', (req, res) => {
  setTimeout(() => {
      res.status(200).send("node - timeout\n");
  }, 5000);
});

app.get('/intensive', (req, res) => {
  var timeout = new Date(new Date().getTime() + 5000);
  while( timeout > new Date() ){}
  res.status(200).send("node - intensive\n");
});


app.listen(PORT, () => {
  console.log("Escuchando en puerto", PORT);
});

