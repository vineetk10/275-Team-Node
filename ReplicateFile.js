function ReplicateFile(call, callback) {
    
    console.log("In replicate file server");

    console.log(call.request);

    callback(null,{
        success: 0
    })
}

exports.ReplicateFile = ReplicateFile;