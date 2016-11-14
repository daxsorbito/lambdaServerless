'use strict';

const AWS = require('aws-sdk');
const request = require('request');
const rp = require('request-promise');
const bluebird = require('bluebird');
const uuid = require('node-uuid');

const s3 = bluebird.promisifyAll(new AWS.S3());

module.exports.getComment = (event, context, callback) => {
  // Call jsonplaceholder
  rp.get(`https://jsonplaceholder.typicode.com/comments/${event.path.id}`)
  .then(function(data) {
    // Set S3 buckets and generate uuid for the key
    const key = `comments-${uuid.v4()}.json`;
    const bucket = 'aws-lambdaserverless-bl-created';
    const params = {
        Bucket: bucket,
        Key: key,
        ACL: 'public-read-write',
        Body: data,
        ContentType: 'application/json'
    }
    // save to s3 and send the file url path
    s3.putObjectAsync(params)
    .then(() => {
      const endpoint = `https://${s3.endpoint.hostname}/${bucket}/${key}`
      const response = {
        statusCode: 200,
        headers: {
           "Content-Type": "application/json",
           "Content-Disposition": `attachment; filename=${key}`
        },
        body: {
          message: 'Success! You could download the file here:',
          fileUrl: endpoint,
        }
      };

      callback(null, response);
    })
    .catch(e => callback(e))
  })
};

module.exports.commentParser = (event, context, callback) => {
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const params = {
    Bucket: bucket,
    Key: key,
  };

  s3.getObjectAsync(params)
  .then((data) => {
    const body = data.Body.toString('utf-8');
    console.log(body);

    callback(null, body);
  })
  .catch(e => callback(e))
};

