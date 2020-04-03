const mongoose = require('mongoose');

exports.clearCollections = async () => {
    try {
        const collections = Object.keys(mongoose.connection.collections);
        const data =  await Promise.all((collections.map(async (collection) => {
            if(collection != "identitycounters"){
                await mongoose.connection.collections[collection].remove({});
                console.log(`Collection ${collection} removed!`);
            }
            
            return 1;
        })));
        return data.length;
    } catch (error) {
        return 0;
    }
};