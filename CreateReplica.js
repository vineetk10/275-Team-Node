const fs = require('fs');
// const Blob = require('buffer')
const util = require('util')
function CreateReplica(call, callback) {
    
    console.log("In replicate server");
    const fileBytes = [];
    var dict = {};
    call.on('data',function(byteStream){
        let fileName = byteStream.filename;
        let bytesInput = Buffer.from(byteStream.payload);
       
        if(bytesInput.length==0){
            console.log("Write into file");
            try{
                var newBuffer = Buffer.concat(dict[fileName]);
                fs.writeFile("/Users/rohitsikrewal/Desktop/"+fileName, newBuffer,function(err, result) {
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
                dict[fileName] = [bytesInput];
            }
            else
            {
                let val = dict[fileName];
                val.push(bytesInput);
            }
        }
       
    });
    call.on('end',function(){
        callback(null,{
            status: "SUCCESS"
        })
    })
}

exports.CreateReplica = CreateReplica;