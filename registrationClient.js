const PROTO_PATH_GATEWAY = './proto/gateway-comm.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');
var ip = require("ip");

var {redisClient} = require('./redisClient');

redisClient.setEx("xx", 3600, "2525");


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

    var ipa = ip.address(); //our ip

    // client_ip is ip of application client or this client ?
    var creds = {
      ip: ipa,
      password : "cmpe275",
      type: "NODE"
    }

    registrationClient.Login(creds, (error, response) => {
      if (response.message != "ERROR"){
        console.log("No error in login");
        console.log(response.masterip);
        console.log(response.message);
        console.log(response.token);
        redisClient.setEx("masterip", 3600, response.masterip);
        redisClient.setEx("token", 3600, response.token);
      } else {
        registrationClient.Register(creds, (error, response) => {
          if (!error){
            console.log("error in login --> register");
            console.log(response.masterip);
            console.log(response.message);
            console.log(response.token);
            redisClient.setEx("masterip", 3600, response.masterip);
            redisClient.setEx("token", 3600, response.token);
          } else {
            console.error(error);
          }
        });
      }
    });
                                         
  }
  
main();