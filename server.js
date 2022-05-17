const PROTO_PATH = './proto/client-comm.proto';
const PROTO_PATH_Node = './proto/node-comm.proto';
const PROTO_PATH_GATEWAY = './proto/gateway-comm.proto';

var ip = require("ip");
var {redisClient} = require('./redisClient');

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

let packageDefinition_node = protoLoader.loadSync(
  PROTO_PATH_Node,
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
let node_comm_proto = grpc.loadPackageDefinition(packageDefinition_node);

let packageDefinition_gateway = protoLoader.loadSync(
  PROTO_PATH_GATEWAY,
  {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
let gateway_comm_proto = grpc.loadPackageDefinition(packageDefinition_gateway).stream;

// console.log("xxxxxx", gateway_comm_proto);

let {isValidToken} = require('./tokenValidation.js');
let {login} = require('./login.js');

let { UploadFile } = require('./UploadFile.js');
let { CreateReplica } = require('./CreateReplica.js');
let { ReplicateFile } = require('./ReplicateFile.js');
let { DownloadFile } = require('./DownloadFile.js');

async function main() {

  let validationResponseObject = await isValidToken();

  var validationResponse = validationResponseObject.isValid;

  console.log("validationResponse -->",validationResponse);

  let server = new grpc.Server();

  if (!validationResponse){
    await login();
    console.log("login function");
  }

  server.addService(client_comm_proto.client.Streaming.service, 
    {UploadFile: UploadFile,
      DownloadFile: DownloadFile
     }
  ); 
  server.addService(node_comm_proto.stream.NodeReplication.service, 
    {CreateReplica: CreateReplica,
      ReplicateFile: ReplicateFile }
  );
  
  server.bind('0.0.0.0:4500', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();