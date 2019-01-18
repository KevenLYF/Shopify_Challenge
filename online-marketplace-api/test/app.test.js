const request = require('supertest');
const app = require('../app');

/** 
 * @test Test invalid role
*/
describe('Test invalid role', function () {
  it('respond with pre-defined error message', function (done) {
      request(app)
          .get('/who?')
          .set('Accept', 'application/json')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(404) //expecting HTTP status code
          .expect('Error: Bad request\n')
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });
});

/** 
 * @test Test customer missing action
*/
describe('Test customer missing action', function () {
  it('respond with pre-defined error message', function (done) {
      request(app)
          .get('/customer?')
          .set('Accept', 'application/json')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(404) //expecting HTTP status code
          .expect('Error: Bad request\n')
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });
});

/** 
 * @test Test seller missing action
*/
describe('Test customer missing action', function () {
  it('respond with pre-defined error message', function (done) {
      request(app)
          .get('/seller?')
          .set('Accept', 'application/json')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(404) //expecting HTTP status code
          .expect('Error: Bad request\n')
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });
});

/** 
 * @test Test seller missing product name on action
*/
describe('Test customer missing action', function () {
  it('respond with pre-defined error message', function (done) {
      request(app)
          .get('/seller?&action=add')
          .set('Accept', 'application/json')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(404) //expecting HTTP status code
          .expect('Error: Bad request\n')
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });
});