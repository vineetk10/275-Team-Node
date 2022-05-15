const fs = require('fs');
// const Blob = require('buffer')
const util = require('util')
function UploadFile(call, callback) {
    
    console.log("In upload server");
    const fileBytes = [];
    var dict = {};
    call.on('data',function(byteStream){
        let fileName = byteStream.filename;
        let bytesInput = byteStream.payload;
       
        if(bytesInput.length==0){
            console.log("Write into file");
            try{
                // fs.writeFile("C:/Users/Checkout/Documents/GRPC-JAVASCRIPT/testing.pdf", new Buffer(fileBytes[fileName]));
                const buffer = Buffer.from(fileBytes[fileName]);
                fs.writeFile("C:/Users/Checkout/Documents/GRPC-JAVASCRIPT/sample.pdf", buffer,function(err, result) {
                    if(err) console.log('error', err);
                  });
            }
            catch(err)
            {
                console.log(err);
            }
        }
        else{
            if(!(fileName in dict))
            {
                fileBytes[fileName] = bytesInput;
            }
            else
            {
                fileBytes[fileName] = fileBytes[fileName] + bytesInput;
                console.log("Bye");
            }
        }
       
    });
    call.on('end',function(){
        callback(null,{
            status: "File saved successfully"
        })
    })
}

exports.UploadFile = UploadFile;