const PROTO_PATH =  './proto/employee.proto';

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
let employee_proto = grpc.loadPackageDefinition(packageDefinition)
console.log(employee_proto);
let { paySalary } = require('./pay_salary.js');
let { generateReport } = require('./generate_report.js');
let { UploadFile } = require('./UploadFile.js');

function main() {
  let server = new grpc.Server();
  server.addService(employee_proto.employee.Employee.service, 
    { paySalary: paySalary,
      generateReport: generateReport,
      UploadFile: UploadFile }
  );
  server.bind('0.0.0.0:4500', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();