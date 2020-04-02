const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

async function connect() {
    try { 
        // await mongoose.connect(`mongodb://${process.env.BASE_DB_URI}/${process.env.MAIN_DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true })
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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