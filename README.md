vestream Directors
=========
An API for Livestream Directors
_____ 
Endpoints
--------
### View All Accounts

```
GET /accounts```

### View One Account
```
GET /accounts/:id```

### Create Account
```
POST /accounts```
Body:
```js
{ "livestream_id": "6488818" }
```

### Update Account
```
POST /accounts/:id```
Body:
```js
{ "livestream_id":"6488818",
  "full_name":"Martin Scorsese",
    "dob":"1942-11-17T00:00:00.000Z",
      "favorite_camera":"Polaroid",
        "favorite_movies":["SomeMovie","AnotherMovie"]
}"```
### Delete Account
```
DELETE /accounts/:id```


## Node Modules

* [Express]
* [Body-parser]
* [Async]
* [Request]
* [Crypto]
* [Lodash]
### Database
* [Redis]
### Testing
* [Mocha]
* [Chai]
* [Supertest]
 

 Test
 ----
 from the repository root, run:
 ```sh
 $ make test
 ```

 [Express]:https://github.com/visionmedia/express
 [Body-parser]:https://github.com/expressjs/body-parser
 [Async]:https://github.com/caolan/async
 [Request]:https://github.com/mikeal/request
 [Crypto]:https://github.com/Gozala/crypto
 [Lodash]:https://github.com/lodash/lodash
 [Redis]:https://github.com/mranney/node_redis
 [Mocha]:https://github.com/visionmedia/mocha
 [Chai]:https://github.com/chaijs/chai
 [Supertest]:https://github.com/visionmedia/supertest
