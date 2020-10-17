const PROTO_PATH = "./customers.proto";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var grpcLogger = require("grpc-logger")

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	arrays: true
});

if (process.env.GRPC_VERBOSITY) {
	switch (process.env.GRPC_VERBOSITY) {
		case 'DEBUG':
			_logVerbosity = LogVerbosity.DEBUG;
			break;
		case 'INFO':
			_logVerbosity = LogVerbosity.INFO;
			break;
		case 'ERROR':
			_logVerbosity = LogVerbosity.ERROR;
			break;
		default:
		// Ignore any other values
	}
}

var customersProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();

/*---------- enable logging using Morgan like Logger ----------*/
grpcLogger(server)
/*---------- enable logging using Morgan like Logger ----------*/

const customers = [
	{
		id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
		name: "John Bolton",
		age: 23,
		address: "Address 1"
	},
	{
		id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
		name: "Mary Anne",
		age: 45,
		address: "Address 2"
	}
];

server.addService(customersProto.CustomerService.service, {

	getAll: (_, callback) => {
		console.log("i received a getAll request", { callback })
		callback(null, { customers });
	},

	get: (call, callback) => {
		console.log("i received a getOne request", { call, callback })

		let customer = customers.find(n => n.id == call.request.id);

		if (customer) {
			callback(null, customer);
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Not found"
			});
		}
	},

	insert: (call, callback) => {
		console.log("i received an insert request", { call, callback })

		let customer = call.request;

		customer.id = uuidv4();
		customers.push(customer);
		callback(null, customer);
	},

	update: (call, callback) => {
		console.log("i received a update request", { call, callback })

		let existingCustomer = customers.find(n => n.id == call.request.id);

		if (existingCustomer) {
			existingCustomer.name = call.request.name;
			existingCustomer.age = call.request.age;
			existingCustomer.address = call.request.address;
			callback(null, existingCustomer);
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Not found"
			});
		}
	},

	remove: (call, callback) => {
		console.log("i received a remove request", { call, callback })

		let existingCustomerIndex = customers.findIndex(
			n => n.id == call.request.id
		);

		if (existingCustomerIndex != -1) {
			customers.splice(existingCustomerIndex, 1);
			callback(null, {});
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Not found"
			});
		}
	}
});

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();
