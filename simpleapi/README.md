## How to use this repository? (server-side)

### Serve (i.e. running in development mode)

To run the serve in development mode, run: 
```javascript
npm run serve
$ [nodemon] 1.18.9
$ [nodemon] to restart at any time, enter `rs`
$ [nodemon] watching: *.*
$ [nodemon] starting `babel-node ./src/app.js`
$ Running stuff on http://127.0.0.1:3000. NODE_ENV: development.
```

Navigate to http://127.0.0.1:3000/ or localhost:3000/. It should display "Welcome to our restful API".
/users will return a random generated user

### Test 

To test the app.js run: 
```javascript
npm run test
```

### Build & Run 

To build the app in the format such that it can be deployed, run: 
```javascript
npm run build
```

A new folder should be created called **./dist** which contains the transpiled code. It can now be run using: 
```javascript
npm start
```