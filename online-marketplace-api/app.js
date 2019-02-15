const express = require('express');

const customer = require('./customer/customer');
const seller = require('./seller/seller');
const list = require('./general/list');

const app = express();

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

/**
 * @api {get} /customer customer put selections in a shopping cart, clear shopping cart and buy products in the cart
 * @apiDescription This endpoint will allow customers buy products from online market place, put items in shopping cart,
 * customers can select product type and quantity
 *
 * @apiParam (query) {String} action
 *                   {String} name
 *                   {Integer} quantity
 *
 * @apiExample {curl} Example usage:
 *   curl -X GET -H "Content-Type: application/json" 'http://localhost:3001/customer?action=select&name=apple&quantity=1'
 *   curl -X GET -H "Content-Type: application/json" 'http://localhost:3001/customer?action=clear'
 *   curl -X GET -H "Content-Type: application/json" 'http://localhost:3001/customer?action=cart'
 *   curl -X GET -H "Content-Type: application/json" 'http://localhost:3001/customer?action=buy'
 * 
 *
 */
app.get('/customer', (req, res) => {  
  const action = req.query.action;
  const name = req.query.name;
  let quantity = req.query.quantity;

  if (action === undefined) {
    throw new Error('Bad request');
  }

  const message = customer.shop(action, name, quantity);

  res.status(200).send(message);
});

/**
 * @api {get} /seller seller restock the products, add new products or remove products
 * @apiDescription This endpoint will allow sellers manage products from online market place,
 * sellers can restock products, add new products and remove products
 *
 * @apiParam (query) {String} action
 *                   {String} name
 *                   {Integer} price 
 *                   {Integer} quantity
 *
 * @apiExample {curl} Example usage:
 *   curl -X GET -H "Content-Type: application/json" 'http://localhost:3001/seller?action=restock&name=apple&quantity=100'
 *   curl -X GET -H "Content-Type: application/json" 'http://localhost:3001/seller?action=add&name=pear&quantity=50&price=10'
 *   curl -X GET -H "Content-Type: application/json" 'http://localhost:3001/seller?action=remove&name=bnana'
 *
 */
app.get('/seller', (req, res) => {  
  const action = req.query.action;
  const name = req.query.name;
  let quantity = req.query.quantity;
  const price = req.query.price;

  if (action === undefined || name === undefined) {
    throw new Error('Bad request');
  }

  const message = seller.manage(action, name, quantity, price);

  res.status(200).send(message);
});

/**
 * @api {get} /list list all the products that are available
 * @apiDescription This endpoint will allow sellers and customers check current products list, 
 *
 * @apiExample {curl} Example usage:
 *   curl -X GET -H "Content-Type: application/json" 'http://localhost:3001/list?filter=available'
 *   curl -X GET -H "Content-Type: application/json" 'http://localhost:3001/list'
 */
app.get('/list', (req, res) => {  
  const filter = req.query.filter;

  const message = list.listProducts(filter);

  res.status(200).send(message);
});

//  Check for invalid request
app.all('*', (req, res) => {
  throw new Error('Bad request');
});

// Error handling
app.use((e, req, res, next) => {
  if (e.message === 'Bad request') {
    res.status(404).send('Error: ' + e.message + '\n');
  }
});


app.listen(3001, () => console.log('App listening on port 3001'));

module.exports = app;