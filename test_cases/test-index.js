/**
 * Test index
 */
const Mocha = require('mocha');
const mocha = new Mocha({
  timeout: 10000
});
const server = require('../bin/www'); // Starts a node server
global.server = server;
mocha.addFile('./test_cases/test-init.js');

const testUtil = require('./test-util');

server.on('listening', () => {
  console.log(`Test-server listning on port ${process.env.PORT}`);
  testUtil.clearCollections()
    .then(() => {
      console.log('STARTING TO RUN MOCHA!');
      try {
        var runner = mocha.run();
        let failCount = 0;
        runner.on('end', () => {
          if (failCount) {
            throw new Error(`${failCount}, Test cases Failed!`);
          } else {
            process.exit(0)  ;
          }
        });
        runner.on('fail', (data) => {
          failCount++;
        })
      } catch (error) {
        console.log('EERERERERERRER = ', error);
      }
    });
});


server.on('close', () => {
  console.log('SERVER CLOSED SUCCESS!');
});

server.on('error', (error) => {
  console.log('Error starting server!');
  console.log(error);
});

