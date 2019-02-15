const SUCCESS = 'success';

const fs = require('fs');

var shop = (action, name, quantity) => {
  if (action === 'select') {
    if (name === undefined) {
      return 'Please specify item name!\n';
    }
    let cart = fetchCart();
    let productsInfo = fetchProducts();

    let product = productsInfo.find((p) => p.title === name);
    if (product === undefined) {
      return `${name} not found in the storage!\n`;
    }
    if (product.inventory_count == 0) {
      return `Sorry, ${name} has been sold out!\n`;
    }
    // if quantity is not specified by the customer, set to default 1
    if (quantity === undefined || quantity.length === 0) {
      quantity = 1;
    }

    let item = cart.find((i) => i.title === name);
    if (item === undefined) {
      item = {
        title: name,
        price: product.price,
        quantity: parseInt(quantity)
      };
    } else {
      item.quantity += parseInt(quantity);
    }

    if (item.quantity > product.inventory_count) {
      return `${name} only has ${product.inventory_count} left !\n`;
    }

    //update shopping cart
    let newCart = cart.filter((i) => i.title != name);
    newCart.push(item)
    if (updateCart(newCart) === SUCCESS) {
      return `${quantity} ${name}(s) has/haven been put in to shopping cart\n`;
    } else {
      return 'Unable to put to shopping cart!\n';
    }
  } else if (action === 'buy') {
    let cart = fetchCart();
    if (cart.length === 0) {
      return 'Shopping cart is empty!\n';
    }
    let productsInfo = fetchProducts();
    let totalCost = 0;
    let log = "Processing payment ... ... \n---------------------------------\n";

    for (item of cart) {
      const product = productsInfo.find((p) => p.title === item.title);
      if (product === undefined) {
        return `Error: ${product.title} no longer available in the storage!\n`;
      }
      if (item.quantity > product.inventory_count) {
        return `Error: ${product.title} only has ${product.inventory_count} left!\n`;
      }
      //  update storage
      let newProductsInfo = productsInfo.filter((p) => p.title != product.title);
      product.inventory_count -= item.quantity;
      newProductsInfo.push(product);
      updateStorage(newProductsInfo);

      //update cart
      removeProductInCart(item.title);

      totalCost += product.price * item.quantity;
      log += `name: ${item.title}\nquantity: ${item.quantity}\ncost: ${item.quantity * product.price}$\nInventory left: ${product.inventory_count}\n`;
      log += '---------------------------------\n';
    }

    if (clearCart() === SUCCESS) {
      return `${log}\nTotal cost: ${totalCost}$\nPurchase successful! Happy Shopping !\n`;
    }
  } else if (action === 'clear') {
      if (clearCart() === SUCCESS) {
        return 'Shopping cart has been cleared!\n';
      }
  } else if (action === 'cart') {
    return listCart();
  } else {
    return 'Action not allowed!\n';
  }
};

var fetchProducts = () => {
  try {
    /*  Use synchronous function in node.js is a bad practice because it blocks other operations,
    *   I only use it for this simple app to make life easier (call-back is not really needed here)
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

var updateCart = (cart) => {
  fs.writeFileSync("cart.json", JSON.stringify(cart))
  return SUCCESS;
}

var fetchCart = () => {
  try {
    /*  Use synchronous function in node.js is a bad practice because it blocks other operations,
    *   I only use it for this simple app to make life easier (call-back is not really needed here)
    */
    const productsData = fs.readFileSync('cart.json');
    return JSON.parse(productsData);
  } catch (e) {
    return [];
  }
}

var removeProductInCart = (name) => {
  let cart = fetchCart();
  let newCart = cart.filter((i) => i.title !== name);
  
  updateCart(newCart);
};

var clearCart = () => {
  const cart = [];
  updateCart(cart);
  return SUCCESS;
}

var listCart = () => {
  let cart = fetchCart();
  let list = `${cart.length} items in cart\n`;
  // for (item of cart) {
  //   list += `------------------------------------\nname: ${item.title}\nprice: ${item.price}$\nquantity: ${item.quantity}\n`
  // }
  // return list;
  return cart;
}

module.exports = {
  shop
}