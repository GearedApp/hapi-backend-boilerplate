const Mongoose = require('mongoose');

// Connect to the database
Mongoose.Promise = global.Promise;
Mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

let db = Mongoose.connection;

// Handle Errors
db.once('open', () => {
  console.log('Connected to MongoDB');
});

db.on('close', (err) => {
  console.error(`Error connecting to MongoDB: ${err}`);
});
