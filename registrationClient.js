const PROTO_PATH_GATEWAY = './proto/gateway-comm.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');

let packageDefinition_gateway = protoLoader.loadSync(
    PROTO_PATH_GATEWAY,
    {keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
});

let gateway_comm_proto = grpc.loadPackageDefinition(packageDefinition_gateway).stream;

function main() {
    let registrationClient = new gateway_comm_proto.Authenticate('localhost:4500',
                                         grpc.credentials.createInsecure());

    var registrationCreds = {
        name : "nodeJs_Node",
        password : "cmpe275",
    }

    // client_ip is ip of application client or this client ?
    var loginCreds = {
      client_ip: "client ip",
      password : "cmpe275",
    }

    registrationClient.Register(registrationCreds, (error, response) => {
      if (!error){
        console.log(response.masterip);
      } else {
        console.error(error);
      }
    });
    
    registrationClient.Login(loginCreds, (error, response) => {
      if (!error){
        console.log(response.msg);
        console.log(response.token);
      } else {
        console.error(error);
      }
    });
                                         
  }
  
main(); 