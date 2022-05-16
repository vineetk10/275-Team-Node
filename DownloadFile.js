const fs = require('fs');
const util = require('util')

async function DownloadFile(call) {

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