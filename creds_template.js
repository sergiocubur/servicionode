let aws_keys = {
    s3: {
        region: 'us-east-1',
        accessKeyId: 'AKIA3777HMDJA64H43BI',
        secretAccessKey: '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'
        //apiVersion: '2006-03-01',
    },
    dynamodb: {
        apiVersion: '2012-08-10',
        region: 'us-east-2',
        accessKeyId: "",
        secretAccessKey: ""
    },
    rekognition: {
        region: '',
        accessKeyId: "",
        secretAccessKey: "" 
    },
    translate: {
        region: '',
        accessKeyId: "",
        secretAccessKey: "" 
    },
    cognito:{
        UserPoolId: '',
        ClientId: ''
    }
}
module.exports = aws_keys