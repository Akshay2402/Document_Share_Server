const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/docsharer', { useNewUrlParser: true, useUnifiedTopology: true })
    } catch (error) {
        throw error;
    }
}

mongoose.connection
    .on('error', (err) => { console.log("Error in MongoDB Connection"); console.error(err); })
    .on('disconnected', reConnect)
    .once('open', listen);

mongoose.connection.on('reconnected', function () {
  console.log('MongoDB reconnected!');
});

function reConnect() {
    if (mongoose.connection.readyState == 0) {
      console.log(mongoose.connection.readyState);
    }
}

function listen() {
    console.log("Data Base Connected");
}

connect();

module.exports = mongoose;