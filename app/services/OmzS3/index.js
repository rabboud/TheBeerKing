import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: 'AKIAJR6W5E3ZZ6XGAXKQ',
    secretAccessKey: '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',
    region: 'us-east-1'
});

const OmzS3 = new AWS.S3({
    params: {
        Bucket: 'omz-public-files'
    }
});

export default OmzS3;
