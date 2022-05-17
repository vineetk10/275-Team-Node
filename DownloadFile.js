const fs = require('fs');
const util = require('util')

let {isValidToken} = require('./tokenValidation.js');
let {login} = require('./login.js');

async function DownloadFile(call) {

    let validationResponseObject = await isValidToken();

    var validationResponse = validationResponseObject.isValid;

    console.log("validationResponse  download file-->",validationResponse);

    if (!validationResponse){
        await login();
        console.log("login function");
    }

    var filePath = "/Users/rohitsikrewal/Documents/GRPC-JAVASCRIPT/";
    try {
        const data = fs.readFileSync(filePath + call.request.filename);
        call.write({ payload: data });
        call.end();
    } catch (error) {
        call.write({ error: 'No such file or directory:  ' + error });
        console.error(error);
        call.end();
    }

}

exports.DownloadFile = DownloadFile;