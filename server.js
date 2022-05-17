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

async function login(gatewayClient) {

  await new Promise((resolve,reject) => {
    gatewayClient.Login({ip: ip.address(), password : "cmpe275", type: "NODE"}, (error, response) => {
      if (error) {
        reject(error)
      }
      console.log("No error in login");
      console.log(response.masterip);
      console.log(response.message);
      console.log(response.token);
      redisClient.setEx("masterip", 3600, response.masterip);
      redisClient.setEx("token", 3600, response.token);
      resolve(response);
  });
  })

}


async function isValidToken(gatewayClient) {

    let storedToken = await redisClient.get('token');

    if (!storedToken){
        return false;
    }
    
    validationReqParams = { client_ip: ip.address(),
                      token: storedToken
                    }
    // console.log("======", validationReqParams);
    
    let res = await new Promise((resolve,reject) => {
      gatewayClient.ValidateToken(validationReqParams, (error, response) => {
        if (!error){
          console.log("xxxxx", response.message);
          if (response.message == "VALID"){
            resolve({ isValid: true });
          }else{
            resolve({ isValid: false });
          }
        } else {
          reject(error);
        }
      });
    })
  return res;
}

let { UploadFile } = require('./UploadFile.js');
let { CreateReplica } = require('./CreateReplica.js');
let { ReplicateFile } = require('./ReplicateFile.js');
let { DownloadFile } = require('./DownloadFile.js');

async function main() {

  var gatewayClient = new gateway_comm_proto.Authenticate('localhost:3000',
                                         grpc.credentials.createInsecure());

  let validationResponseObject = await isValidToken(gatewayClient);

  var validationResponse = validationResponseObject.isValid;

  console.log("validationResponse -->",validationResponse);

  let server = new grpc.Server();

  if (!validationResponse){
    await login(gatewayClient);
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