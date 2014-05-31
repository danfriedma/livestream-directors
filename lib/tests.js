var should = require('chai').should()
  , app = require('../server')
  , api = require('supertest');


var id = "6488818";
var bad_id = "1000000000";
var livestream_id = { livestream_id: '6488818' };
var bad_livestream_id = { livestream_id: '1000000000' };
var authorization = "Bearer 10f607392e9e569848a4f03a8cc206ff";

var invalid_movies_body = {
    "livestream_id":"6488818",
    "full_name":"Martin Scorsese",
    "dob":"1942-11-17T00:00:00.000Z",
    "favorite_camera":"something",
    "favorite_movies":[5]
  }
var invalid_dob_body = {
    "livestream_id":"6488818",
    "full_name":"Martin Scorsese",
    "dob":"",
    "favorite_camera":"somesthing",
    "favorite_movies":["somethingelse"]
  }

var valid_body = {
    "livestream_id":"6488818",
    "full_name":"Martin Scorsese",
    "dob":"1942-11-17T00:00:00.000Z",
    "favorite_camera":"",
    "favorite_movies":[]
  }



describe('POST', function() {

  it('id', function(done) {
    api(app).post('/accounts')
    .set('Content-Type','application/json')
    .send(JSON.stringify(livestream_id))
    .expect(200)
    .expect(JSON.stringify(valid_body), done);
  });

  it('bad_id', function(done) {
    api(app).post('/accounts')
    .set('Content-Type','application/json')
    .send(JSON.stringify(bad_livestream_id))
    .expect(400)
    .expect({error:"Bad Request"}, done);
  });

  it('id already exists', function(done) {
    api(app).post('/accounts')
    .set('Content-Type','application/json')
    .send(JSON.stringify(livestream_id))
    .expect(400)
    .expect({error:"Director Already Exists"}, done);
  });



});

describe('PUT', function() {
 
  it('wrong auth', function(done) {
    api(app).post('/accounts/' + id)
    .set('Content-Type','application/json')
    .set('authorization', 'Bearer 123myapikey')
    .send(JSON.stringify(valid_body))
    .expect(401, done)
  });
  
  it('bad header', function(done) {
    api(app).post('/accounts/' + id)
    .set('Content-Type','application/json')
    .set('authorization', "")
    .send(JSON.stringify(valid_body))
    .expect(401)
    .expect({error:"Not Authorized"}, done);
  });
 
  it('bad favorite_movies', function(done) {
    api(app).post('/accounts/' + id)
    .set('Content-Type','application/json')
    .set('authorization', authorization)
    .send(JSON.stringify(invalid_movies_body))
    .expect(400)
    .expect({error:"Type Mismatch"}, done);
  });

    it('bad dob', function(done) {
    api(app).post('/accounts/' + id)
    .set('Content-Type','application/json')
    .set('authorization', authorization)
    .send(JSON.stringify(invalid_dob_body))
    .expect(400)
    .expect({error:"Cannot Update That Field"}, done);
  });

    it('should succeed', function(done) {
    api(app).post('/accounts/' + id)
    .set('Content-Type','application/json')
    .set('authorization', authorization)
    .send(JSON.stringify(valid_body))
    .expect(200, done)
  });

});

describe('GET', function() {
 
  it('/accounts', function(done) {
    api(app).get('/accounts')
    .expect(200)
    .expect('["{\\"livestream_id\\":\\"6488818\\",\\"full_name\\":\\"Martin Scorsese\\",\\"dob\\":\\"1942-11-17T00:00:00.000Z\\",\\"favorite_camera\\":\\"\\",\\"favorite_movies\\":[]}"]', done);
  });
 
  it('/accounts/:id', function(done) {
    api(app).get('/accounts/' + id)
    .expect(200)
    .expect(JSON.stringify(valid_body), done);
  });

    it('/accounts/:bad_id', function(done) {
    api(app).get('/accounts/' + bad_id)
    .expect(400)
    .expect({error:"Not Found"}, done);
  });
 
});

describe('DELETE', function() {
 
  it('/accounts/:id', function(done) {
    api(app).delete('/accounts/' + id)
    .expect(200, done);
  });
 
  it('/accounts/:bad_id', function(done) {
    api(app).delete('/accounts/' + id)
    .expect(400)
    .expect({error:"Nothing To Delete"}, done);
  });
 
});
