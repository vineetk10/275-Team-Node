const fs = require('fs');

function UploadFile(call, callback) {
    
    console.log("In upload server");
    const fileBytes = [];
    var dict = {};
    call.on('data',function(byteStream){
        let fileName = byteStream.filename;
        let bytesInput = byteStream.payload;
        if(bytesInput.length==0){
            console.log("Write into file");
            var blob = new Blob(fileBytes[fileName], {type: "application/pdf"});
            fs.createWriteStream("C:/Users/Checkout/Documents/GRPC-JAVASCRIPT").write(blob);
        }
        else{
            if(!(fileName in dict))
            {
                fileBytes[fileName] = bytesInput;
            }
            else
            {
                fileBytes[fileName] = fileBytes[fileName] + bytesInput;
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