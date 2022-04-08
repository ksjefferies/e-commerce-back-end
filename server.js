const express = require('express');
const { sequelize } = require('./models/Product');
const routes = require('./routes');
// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const main = async () => {
  console.log(`Starting application on ${PORT}`);
  await sequelize.sync({ force: false })
  app.listen(PORT)
}

main();
// sync sequelize models to the database, then turn on the server
// (async () => {await sequelize.sync({ force: false })})()
// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}!`);
// });
