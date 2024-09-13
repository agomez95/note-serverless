const AWS = require('aws-sdk');
const Cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.register = async (event) => {
    const { email, password } = JSON.parse(event.body);

    const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: "email",
                Value: email
            },
        ],
    };

    const confirmParams = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
    };

    try {
        await Cognito.signUp(params).promise();
        await Cognito.adminConfirmSignUp(confirmParams).promise();

        return {
            status: 200,
            body: {
                message: "User registered succesfully"
            }
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            body: {
                message: "Error registering user"
            }
        }
    }
};