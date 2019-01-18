const seller = require('../seller/seller');
const customer = require('../customer/customer');

beforeAll( () => {
  seller.manage('add', 'customerTest', 0, 10);
  seller.manage('add', 'customerTest2', 10, 10);
  return 0;
});

/**
 * @test test customer select product that dose not exist
 */
test("Customer select product that dose not exist", () => {
  expect(customer.shop('select', 'customerTest3', 10)).toEqual("customerTest3 not found in the storage!\n");
});

/**
 * @test test customer select product that has been sold out
 */
test("Customer select product that has been sold out", () => {
  expect(customer.shop('select', 'customerTest', 10)).toEqual("Sorry, customerTest has been sold out!\n");
});

/**
 * @test test customer select product with quantity that exceeds the inventory count
 */
test("Customer select product with quantity that exceeds the inventory count", () => {
  expect(customer.shop('select', 'customerTest2', 20)).toEqual("customerTest2 only has 10 left !\n");
});

/**
 * @test test customer buy product when shopping cart is empty
 */
test("Customer buy product when shopping cart is empty", () => {
  expect(customer.shop('buy')).toEqual("Shopping cart is empty!\n");
});

/**
 * @test test customer invalid action
 */
test("Customer invalid action", () => {
  expect(customer.shop('restock')).toEqual("Action not allowed!\n");
});

/**
 * @test test customer invalid action
 */
test("Customer invalid action", () => {
  expect(customer.shop('add')).toEqual("Action not allowed!\n");
});

afterAll( () => {
  seller.manage('remove', 'customerTest');
  seller.manage('remove', 'customerTest2');
  return 0;
});