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

  fs.open(filePath, 'r+', function (err, fd) {
    if (err) {
        return console.error(err);
    }
  
    console.log("Reading the file");
  
    fs.read(fd, buffer, 0, buffer.length,
        0, function (err, bytes) {
            if (err) {
                console.log(err);
            }
  
            // if (bytes > 0) {
            //     console.log(buffer.
            //         slice(0, bytes).toString());
            // }
            console.log(bytes + " bytes read");
            let call = client.UploadFile({filename: "testing", payload:buffer})
            // Close the opened file.
            fs.close(fd, function (err) {
                if (err) {
                    console.log(err);
                }
  
                console.log("File closed successfully");
            });
        });
});


  try {
    const data = fs.readFileSync(filePath).toString('hex');
    let call = client.UploadFile({filename: "testing", payload:data})
    call.end();
    console.log(data);
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