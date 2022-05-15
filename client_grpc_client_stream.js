const PROTO_PATH = './proto/client-comm.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');
const fs = require('fs');

let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
let client_comm_proto = grpc.loadPackageDefinition(packageDefinition).client;

function main() {

  let client = new client_comm_proto.Streaming('localhost:4500',
                                        grpc.credentials.createInsecure());                                     
var buffer = new Buffer.alloc(1024);
  let filePath = "C:/Users/Checkout/Downloads/sample.pdf";

  try {
    const data = fs.readFileSync(filePath);
    let call = client.UploadFile(function (error, response) {
      console.log(response);
    });
   
      call.write({filename: "testing", payload:data});
      call.write({filename: "testing", payload:''});
    call.end();

  } catch (err) {
    console.error(err);
  }

}

main();