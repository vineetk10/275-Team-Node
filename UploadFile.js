const fs = require('fs');
const util = require('util')
const PROTO_PATH1 = './proto/master-comm.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');
const PROTO_PATH_Node = './proto/node-comm.proto';

var {redisClient} = require('./redisClient');


let packageDefinition_node = protoLoader.loadSync(
    PROTO_PATH_Node,
    {keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });

let node_comm_proto = grpc.loadPackageDefinition(packageDefinition_node).stream;

let {isValidToken} = require('./tokenValidation.js');
let {login} = require('./login.js');

let packageDefinition1 = protoLoader.loadSync(
    PROTO_PATH1,
    {keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });

let master_comm_proto = grpc.loadPackageDefinition(packageDefinition1).stream;

async function abcd(nodeIpsToReplicate, fileName, buffer) {
    return await new Promise((resolve, reject) => {
        let successips = [];

        nodeIpsToReplicate.forEach(nodeip => {
            try {
                let client_node = new node_comm_proto.NodeReplication(nodeip,
                                grpc.credentials.createInsecure());
                // const data = fs.readFileSync(filePath);

                
                let call =  client_node.CreateReplica(function (error, response) {
                if (response.status == "SUCCESS") {
                    console.log("rohit--->", nodeip)
                    successips.push(nodeip);
                    console.log("rohit--->", successips)
                }
                console.log("----->", response);
                });
                call.write({filename: fileName, payload:buffer});
                call.write({filename: fileName, payload:''});
                call.end();
                

            } catch (error) {
                reject(error);
            }
        
        });
        
        // resolve({successips: successips});
        resolve({successips: nodeIpsToReplicate});

    })
}


async function UploadFile(call, callback) {

    let validationResponseObject = await isValidToken();

    var validationResponse = validationResponseObject.isValid;

    console.log("validationResponse  upload file-->",validationResponse);

    if (!validationResponse){
        await login();
        console.log("login function");
    }

    let client1 = new master_comm_proto.Replication('localhost:4502',
  grpc.credentials.createInsecure());    
    
    console.log("In upload server");
    var dict = {};
    await call.on('data',async function(byteStream){
        let fileName = byteStream.filename;
        let bytesInput =  Buffer.from(byteStream.payload);
        if(bytesInput.length==0){
            console.log("Write into file");
            try{
                
                var newBuffer = Buffer.concat(dict[fileName]);
                await new Promise((resolve,reject) => {
                    fs.writeFile("C:/Users/Checkout/Documents/testing.pdf",newBuffer,function(err, result) {
                        if(err) {console.log('error', err); reject(err);}
                        console.log("File saved successfully");
                        resolve(result);
                      });
                })
                
                let nodeIpsToReplicate = [];

                await new Promise((resolve,reject) => {
                    let call2 =  client1.GetNodeIpsForReplication({filename: "sample"},function (error, response) {
                        if(error)
                        {
                            console.log("Error is "+error);
                            reject(error);
                        }
                        else
                        {
                            console.log("Response is "+response.nodeips[0]);
                            nodeIpsToReplicate = response.nodeips;
                            resolve(response.nodeips);
                        }
                    });
                })
                
                console.log("Hi "+nodeIpsToReplicate.length);
            
            let successips =  await abcd(nodeIpsToReplicate, fileName,  buffer)
            .then((res) => {
                console.log("then--->", res)
                return res.successips})
            .catch((error) => console.log("error==>",error));
            
            console.log("nodeips--->", successips);

            let masterip = await redisClient.get('masterip')
            // let masterip = "localhost:8000"
            let master_node_client = new master_comm_proto.Replication(masterip, grpc.credentials.createInsecure());

            let ReplicationDetailsRequest ={
                filename: fileName,
                nodeips: successips
            }

            console.log("req body++++++", ReplicationDetailsRequest)

            let update_replication_call = master_node_client.UpdateReplicationStatus(ReplicationDetailsRequest, function (error, response) {
                console.log("res status======", response.status);
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
            status: "File saved successfully"
        })
    })
}

exports.UploadFile = UploadFile;