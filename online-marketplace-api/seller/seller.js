const SUCCESS = 'success';

const fs = require('fs');

var manage = (action, name, quantity, price) => {
  // default quantity for restock and add is 10
  if (quantity === undefined) {
    quantity= 10;
  }

  if (action === 'add') {
    return addProduct(name, quantity, price);
  } else if (action === 'restock') {
    return restock(name, quantity);
  } else if (action === 'remove') {
    return removeProduct(name);
  } else {
    return 'Action not allowed!\n';
  }
};

var addProduct = (name, quantity, price) => {
  let productsInfo = fetchProducts();
  let found = productsInfo.find((p) => p.title === name);
  if (found !== undefined) {
    return "Product already exists!\n";
  }
  
  if (price === undefined) {
    return "Price missing!\n"
  }

  const product = {
    title: name,
    price,
    inventory_count: parseInt(quantity)
  };

  productsInfo.push(product);
  if (updateStorage(productsInfo) === SUCCESS) {
    return `${product.title} has been added to storage !\nProduct: ${product.title}\nPrice: ${product.price}$\nInventory: ${product.inventory_count}\n`;
  } else {
    return 'Unable to add product!\n';
  }
};

var restock = (name, quantity) => {
  let productsInfo = fetchProducts();

  let product = productsInfo.find((p) => p.title === name);

  if (product === undefined) {
    return `${name} not found in the storage!\n`;
  }

  // update product inventory
  let newProducts = productsInfo.filter((p) => p.title != product.title);
  product.inventory_count = parseInt(product.inventory_count) + parseInt(quantity);
  newProducts.push(product);

  if (updateStorage(newProducts) === SUCCESS) {
    // return `Restock successful !\nProduct: ${product.title}\nInventory: ${product.inventory_count}\n`;
    return newProducts;
  } else {
    return `Unable to restock ${product.title}\n!`;
  }
};

var removeProduct = (name) => {
  let productsInfo = fetchProducts();
  let newProducts = productsInfo.filter((p) => p.title !== name);
  
  if (productsInfo.length === newProducts.length) {
    return `${name} not found in the storage!\n`;
  }
  if (updateStorage(newProducts) === SUCCESS) {
    return `${name} removed from storage !\n`;
  } else {
    return `Unable to remove ${product.title}!\n`;
  }
};

var fetchProducts = () => {
  try {
    /*  Use synchronous function in node.js is a bad practice because it blocks other operations,
    *   I only use it for this simple app to make life easier (call-back would be an over-kill needed here)
    */
    const productsData = fs.readFileSync('storage.json');
    return JSON.parse(productsData);
  } catch (e) {
    return [];
  }
};

var updateStorage = (products) => {
  fs.writeFileSync("storage.json", JSON.stringify(products))
  return SUCCESS;
};

module.exports = {
  manage
}
  