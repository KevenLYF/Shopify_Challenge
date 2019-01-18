const seller = require('../seller/seller');

beforeAll( () => {
  return seller.manage('add', 'sellerTest', 10, 10);
});

/**
 * @test test seller add product that is already exist
 */
test("Seller add product that is already exist", () => {
  expect(seller.manage('add', 'sellerTest', 10, 10)).toEqual("Product already exists!\n");
});

/**
 * @test test seller add product without specifying price
 */
test("Seller add product without price", () => {
  expect(seller.manage('add', 'sellerTest 2', '10')).toEqual("Price missing!\n");
});

/**
 * @test test seller restock product that does not exist
 */
test("Seller restock product that does not exist", () => {
  expect(seller.manage('restock', 'sellerTest2', '10')).toEqual("sellerTest2 not found in the storage!\n");
});

/**
 * @test test seller remove product that does not exist
 */
test("Seller remove product that does not exist", () => {
  expect(seller.manage('remove', 'sellerTest2')).toEqual("sellerTest2 not found in the storage!\n");
});

/**
 * @test test invalid seller action
 */
test("Seller invalid action", () => {
  expect(seller.manage('buy')).toEqual("Action not allowed!\n");
});

afterAll( () => {
  return seller.manage('remove', 'sellerTest');
});