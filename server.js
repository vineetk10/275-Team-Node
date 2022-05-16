const PROTO_PATH = './proto/client-comm.proto';
const PROTO_PATH_Node = './proto/node-comm.proto';

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

let { UploadFile } = require('./UploadFile.js');
let { CreateReplica } = require('./CreateReplica.js');
let { ReplicateFile } = require('./ReplicateFile.js');

function main() {
  let server = new grpc.Server();
  server.addService(client_comm_proto.client.Streaming.service, 
    {UploadFile: UploadFile }
  );
  server.addService(node_comm_proto.stream.NodeReplication.service, 
    {CreateReplica: CreateReplica,
      ReplicateFile: ReplicateFile }
  );
  server.bind('0.0.0.0:4500', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();