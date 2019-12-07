const { EventStorage, StorageClose, insertOne } = require('../storage/storage-mongodb');

/**
 * A simple example includes a HTTP post method to add one item to a MongoDB Atlas database collection.
 */
exports.putEventHandler = async event => {
    const { body, httpMethod, stage = 'prod' } = event;
    if (httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${httpMethod} method.`);
    }
    // All log statements are written to CloudWatch by default. For more information, see
    // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html
    console.log('received:', JSON.stringify(event));

    // TODO storage (mongoDb) validator on stage and required event fields http://mongodb.github.io/node-mongodb-native/3.2/tutorials/collections/
    // TODO create indexes when required
    const eventBody = JSON.parse(body);
    let response;
    let storage;
    try {
        storage = await EventStorage(stage)();
        const events = storage.collection;
        let result = await insertOne(events, eventBody);
        response = {
            statusCode: 200,
            ...result
        };
    } catch (e) {
        response = {
            statusCode: 500,
            e
        };
    }
    await StorageClose(storage);

    // console.log(`response from: putEventHandler statusCode: ${response.statusCode} body: ${response}`);
    return response;
};
