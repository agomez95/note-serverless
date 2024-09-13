const AWS = require('aws-sdk');
const Cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.login = async (event) => {
    const { email, password } = JSON.parse(event.body);
    
    const params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
            //username: email,
            //password: password,
            USERNAME: email,   // Cambiado a mayúsculas
            PASSWORD: password, // Cambiado a mayúsculas
        }
    };
    
    try {
        const response = await Cognito.initiateAuth(params).promise();
        
        return {
            status: 200,
            //body: response.AuthenticationResult
            body: {
                token: response.AuthenticationResult.AccessToken, // Puedes incluir también otros tokens
                refreshToken: response.AuthenticationResult.RefreshToken,
                idToken: response.AuthenticationResult.IdToken
            },
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            body: JSON.stringify({
                message: "Error logging in user",
                error: error.message,
            }),
        }
    }
};