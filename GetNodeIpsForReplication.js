function GetNodeIpsForReplication(call, callback)
{
    console.log("in replication");
    // call.on('data',function(obj){
    //     console.log(obj.filename);
    // });
    // call.on('end',function(){
    //     callback(null,{
    //         nodeips: ["localhost:4500"]
    //     })
    // })
    callback(null,{
                nodeips: ["localhost:4500"]
            })
    // call2.write({ nodeips: ["localhost:4502"] });
    // call2.end();
    // return {nodeips: ["localhost:4500"]};
}

exports.GetNodeIpsForReplication = GetNodeIpsForReplication;