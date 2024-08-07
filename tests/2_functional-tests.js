const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=xy_z')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello xy_z');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({ surname: "Colombo" }) // Add this line to send the data
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.name, 'Cristoforo'); // Add this line to check the response
          assert.equal(res.body.surname, 'Colombo'); // Add this line to check the response
          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({ surname: "da Verrazzano" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.name, 'Giovanni');
          assert.equal(res.body.surname, 'da Verrazzano');
          done();
        });
    });
  });
});

const Browser = require('zombie');

suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);
  const Browser = require('zombie');
  Browser.site = 'http://localhost:3000'; // Replace with your server's address
  const browser = new Browser();

  suite('Headless browser', function () {
    test('should have a working "site" property', function() {
      assert.isOk(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      browser.visit('/', function() {
        browser.fill('surname', 'Colombo');
        browser.pressButton('submit', function() {
          browser.assert.success();
          browser.assert.text('span#surname', 'Colombo');
          done();
        });
      });
    });
    // #6
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.visit('/', function() {
        browser.fill('surname', 'Vespucci')
        browser.pressButton('submit', function() {
          browser.assert.success();
          browser.assert.text('span#surname', 'Vespucci');
          done();
        });
      });
    });
  });
});
