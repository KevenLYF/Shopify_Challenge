const fs = require('fs');

var listProducts = (filter) => {

  const showAll = (filter !== 'available');
  let productsInfo = fetchProducts();
  let list = '';
  let filterList = '';
  let outStockCount = 0;
  for (product of productsInfo) {
    if (product.inventory_count > 0) {
      list += `------------------------------------\nname: ${product.title}\nprice: ${product.price}$\ninventory: ${product.inventory_count}\n`;
    } else {
      outStockCount++;
      if (showAll) {
        filterList += `------------------------------------\nname: ${product.title}\nprice: ${product.price}$\ninventory: ${product.inventory_count}\n`;
      }
    }
  }
  // return `${list + filterList}------------------------------------\n${productsInfo.length} products in storage, ${outStockCount} products out of stock.\n`;
  return productsInfo;
};

var fetchProducts = () => {
  try {
    /*  Use synchronous function in node.js is a bad practice because it blocks other operations,
    *   I only use it for this simple app to make life easier (call-back would be an over-kill needed here)
    */
    const productsData = fs.readFileSync('./storage.json');
    return JSON.parse(productsData);
  } catch (e) {
    return [];
  }
};

module.exports = {
  listProducts
}