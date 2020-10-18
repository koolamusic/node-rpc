var grpc = require("grpc");
var booksProto = grpc.load("books.proto");


// In-memory array of book objects
var books = [ 
  { id: 123, title: 'A Tale of Two Cities', author: 'Charles Dickens' }
];

var server = new grpc.Server();
server.addService(booksProto.books.BookService.service, {
    list: function(call, callback) {
        callback(null, books);
    },
	// add the insert call
	insert: function(call, callback) {
		const book = call.request;
		books.push(book);
		callback(null, {});
	}
});


server.bind("0.0.0.0:50051",
	grpc.ServerCredentials.createInsecure());
console.log("Server running on http://0.0.0.0:50051");

server.start();
