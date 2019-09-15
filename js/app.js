const express = require('express');

const PORT = 3000;
const app = express();

app.get('/', (req, res) => {
  res.status(200).send("Ping");
});

app.get('/timeout', (req, res) => {
  setTimeout(() => {
      res.status(200).send("Ping");
  }, 5000);
});


app.listen(PORT, () => {
  console.log("Escuchando en puerto", PORT);
});

