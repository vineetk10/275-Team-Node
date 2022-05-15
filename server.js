const PROTO_PATH = './proto/client-comm.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');


let packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
let client_comm_proto = grpc.loadPackageDefinition(packageDefinition)

let { UploadFile } = require('./UploadFile.js');

function main() {
  let server = new grpc.Server();
  server.addService(client_comm_proto.client.Streaming.service, 
    {UploadFile: UploadFile }
  );
  server.bind('0.0.0.0:4500', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();