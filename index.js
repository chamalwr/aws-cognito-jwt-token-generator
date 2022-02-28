require('dotenv').config();
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

var poolData = {
	UserPoolId: process.env.USER_POOL_ID,
	ClientId: process.env.CLIENT_ID,
};

const poolRegion = process.env.POOL_REGION;
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const login = function(userName, password){
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: userName,
        Password: password,
    });

    var userData =  {
        Username: userName,
        Pool: userPool,
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result){
            console.log(result);
        },

        onFailure: function(error){
            console.log(error);
        },

        newPasswordRequired: function(userAttributes){
            delete userAttributes.email_verified;
            cognitoUser.completeNewPasswordChallenge(
                password,
                userAttributes,
                this
            )
        }
    })
}

login('username', 'password');