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
// let employee_proto = grpc.loadPackageDefinition(packageDefinition).employee;
let client_comm_proto = grpc.loadPackageDefinition(packageDefinition).client;

function main() {
  // let client = new employee_proto.Employee('localhost:4500',
  //                                      grpc.credentials.createInsecure());
  let client = new client_comm_proto.Streaming('localhost:4500',
                                        grpc.credentials.createInsecure());                                     
  // let employeeIdList = [1,10,2];
//   let call = client.paySalary({employeeIdList: employeeIdList});
//   let call = client.generateReport(function (error, response) {
//     console.log("Reports successfully generated for: ", response.successfulReports);
//     console.log("Reports failed since Following Employee Id's do not exist: ", response.failedReports);
//   });
//   _.each(employeeIdList, function (employeeId) {
//     call.write({ id: employeeId });
// })
var buffer = new Buffer.alloc(1024);
  let filePath = "C:/Users/Checkout/Downloads/sample.pdf";

  try {
    const data = fs.readFileSync(filePath);
    // let call = client.UploadFile({filename: "testing", payload:data})
    let call = client.UploadFile(function (error, response) {
      console.log(response);
    });
   
      call.write({filename: "testing", payload:data});
      call.write({filename: "testing", payload:''});
  // console.log(buffer.toString('utf8', 0, num));
    call.end();

  } catch (err) {
    console.error(err);
  }
  


//   call.on('data',function(response){
//     console.log(response.message);
//   });

//   call.on('end',function(){
//     console.log('All Salaries have been paid');
//   });

}

main();