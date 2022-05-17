const fs = require('fs');
const util = require('util')
const PROTO_PATH1 = './proto/master-comm.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');
const PROTO_PATH_Node = './proto/node-comm.proto';


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
    const fileBytes = [];
    var dict = {};
    await call.on('data',async function(byteStream){
        let fileName = byteStream.filename;
        let bytesInput = byteStream.payload;
       
        if(bytesInput.length==0){
            console.log("Write into file");
            try{
                // fs.writeFile("C:/Users/Checkout/Documents/GRPC-JAVASCRIPT/testing.pdf", new Buffer(fileBytes[fileName]));
                var buffer = Buffer.from(fileBytes[fileName]);

                await new Promise((resolve,reject) => {
                    fs.writeFile("/Users/rohitsikrewal/Documents/GRPC-JAVASCRIPT/sample225.pdf", buffer,function(err, result) {
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
                
                nodeIpsToReplicate.forEach(nodeip => {
                    try {
                        let client_node = new node_comm_proto.NodeReplication(nodeip,
                                        grpc.credentials.createInsecure());
                        // const data = fs.readFileSync(filePath);
                        let call = client_node.CreateReplica(function (error, response) {
                          console.log(response);
                        });
                        call.write({filename: "testing", payload:buffer});
                        call.write({filename: "testing", payload:''});
                        call.end();
                      } catch (err) {
                        console.error(err);
                      }
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