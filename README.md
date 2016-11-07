# Lambda Serverless example
## This has two lambda functions
1. getComments
  1. event trigger is the invocation of the API gateway end point generated by *severless* (e.g https://XXXXX.us-east-1.amazonaws.com/dev/comments/5), see *serverless* generated endpoint example below.
  2. calls [jsonplacehoder](https://jsonplaceholder.typicode.com/) to get dummy comments data.
  3. store the retrieve data from above to S3 on the *aws-lambdaserverless-bl-created* bucket
  4. returns a success message with file url to download the file
2. commentParser
  1. event trigger is s3:ObjectCreated:* in the *aws-lambdaserverless-comment-inbox* bucket
  2. this would then get the object given that it has a *prefix* of _'comments-'_ and *suffix* of _'.json'_
  3. console log the data.Body - displaying it in CloudWatch

## Set-up
- ```$ npm i serverless -g```
- clone this repo and cd to the folder
- ```$ npm i```
- ```$ sls deploy -v```
- open the endpoint generated by serverless, and supply the necessary *id* (this is the same id that would be passed to jsonplaceholder to retrive a dummy comment data).
Example of the generated endpoint below:
```
Service Information
service: aws-lambdaServerless-bl
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  GET - https://2po4y4sn2c.execute-api.us-east-1.amazonaws.com/dev/comments/{id}
functions:
  aws-lambdaServerless-bl-dev-commentParser: arn:aws:lambda:us-east-1:897428427632:function:aws-lambdaServerless-bl-dev-commentParser
  aws-lambdaServerless-bl-dev-getComment: arn:aws:lambda:us-east-1:897428427632:function:aws-lambdaServerless-bl-dev-getComment
  ```
- then you would get this message when you invoke the above end point. Please note at the _fileUrl_ returned.
```js
{
"statusCode": 200,
"body": "{"message":"Success! You could download the file here:","fileUrl":"https://s3.amazonaws.com/aws-lambdaserverless-bl-created/comments-be9a0f9f-5af2-4e3a-ba60-f89e21b71c54.json"}"
}
```
- download this file by accessing the _fileUrl_ link and store the file in your local drive. This would later be uploaded to trigger the *commentParser* lambda function.
- run this ```$ sls logs -f commentParser -t``` on the terminal,
this would allow us to watch what is being logged in the *commentParser* lambda function
- go to your AWS S3 and locate the bucket *aws-lambdaserverless-comment-inbox* and upload the downloaded file
- after upload look at the terminal where you executed ```$ sls logs``` to see the content of the file


## Note
- change the bucket names in the code as these are being used already
