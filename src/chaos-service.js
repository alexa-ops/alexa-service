'use strict';

const BbPromise = require('bluebird');
const AWS = require('aws-sdk');

const lambda = new AWS.Lambda({
    region: 'us-east-1' //change to your region
});

const invokeLambda = (lambdaName, event) => {
    const params = {
        FunctionName: lambdaName,
        // InvocationType: 'Event', // run async
        Payload: JSON.stringify(event),
    };

    return new BbPromise((resolve, reject) => {
        lambda.invoke(params, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Received result: ', data);
            resolve(data);
        });
    });
}

const lambdaResolver = (lambdaName) => (event) => invokeLambda(lambdaName, event)
                .then((data) => JSON.parse(data.Payload));

const countBy = lambdaResolver(process.env.COUNT_LAMBDA);
const terminate = lambdaResolver(process.env.TERMINATE_LAMBDA);
const stop = lambdaResolver(process.env.STOP_LAMBDA);

module.exports = {
    countBy,
    terminate,
    stop,
}
