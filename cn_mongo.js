const mongoClient = require('mongodb').MongoClient;
const express = require('express');
const url = require('url');

const app = express();
const port = 3000;

const mongo_uri = 'mongodb://127.0.0.1:27017/';

mongoClient.connect(mongo_uri, function (err, db) {
    if (err) throw err;
       var dbase = db.db("Shop");
       dbase.createCollection('products', function(err, res) {
           if (err) throw err;
           console.log("Collection created!");
           db.close();   //close method has also been moved to client obj
     });
});

app.get('/addProduct', (req, response) => {
    mongoClient.connect(mongo_uri, function(err, db) {

       if (err) throw err;

       var dbase = db.db("Shop");
       var products = dbase.collection('products');
       var data = [
           {name: "ao phong", price: 75000, category: "quan ao" },
           {name: "giay the thao", price: 75000, category: "giay dep" },
           {name: "kinh", price: 375000, category: "Thoi trang" },
       ];
       products.insert(data, function (err,res) {
           if (err) throw err;
           response.writeHead(200, {'Content-Type': 'text/html'});
           response.end('<h3>Add data Successful!!</h3>');
       });
       db.close();
    });
});

app.get('/update', (req, response) => {
    mongoClient.connect(mongo_uri, function(err, db) {

       if (err) throw err;

       var dbase = db.db("Shop");
       var products = dbase.collection('products');
        products.updateMany({name: 'ao phong'}, {$set: {name: 'ao thun trang'} }, function (err,res) {
            if (err) throw err;
            console.log('update success: ' + res.result.nModified + ' records');
        });
        db.close();
    });
});

app.get('/delete', (req, response) => {
    mongoClient.connect(mongo_uri, function(err, db) {

       if (err) throw err;

       var dbase = db.db("Shop");
       var products = dbase.collection('products');

        products.deleteMany({name: 'ao phong'}, function (err,res) {
            if (err) throw err;
            console.log('delete success: ' + res.result.n + ' record');
        });
        db.close();
    });
});

app.get('/', (request, response) => {
    mongoClient.connect(mongo_uri, function(err, db) {
        if (err) throw err;
        var dbase = db.db("Shop");

        var products = dbase.collection('products');

        products.find({}).sort({price: 1}).toArray(function (err,results) {
            if (err) throw err;

            data = '<table border="1" style="border-collapse:collapse" cellspacing="5" cellpadding="15">';
            data += '<tr><th>Name</th><th>Price</th><th>Category</th></tr>';
            results.forEach(function (row) {
                data += '<tr>';
                data += '<td>' + row.name + '</td>';
                data += '<td>' + row.price + '</td>';
                data += '<td>' + row.category + '</td>';
                data += '</tr>';
            });
            data += '</table>';
            
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(data);
        })
        db.close();
    });
});

app.get('/:id', (request, response) => {
    mongoClient.connect(mongo_uri, function(err, db) {
        if (err) throw err;
        var dbase = db.db("Shop");

        var products = dbase.collection('products');

        var url_parts = url.parse(request.url, true);
        var id = request.query.id;

        products.find({_id: id}).toArray(function (err,results) {
            if (err) throw err;

            data = '<table border="1" style="border-collapse:collapse" cellspacing="5" cellpadding="15">';
            data += '<tr><th>Name</th><th>Price</th><th>Category</th></tr>';
            results.forEach(function (row) {
                data += '<tr>';
                data += '<td>' + row.name + '</td>';
                data += '<td>' + row.price + '</td>';
                data += '<td>' + row.category + '</td>';
                data += '</tr>';
            });
            data += '</table>';
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(data);
        })
        db.close();
    });
});

var server = app.listen(3000, function(req, res){
  var host = server.address().address;
  var port = server.address().port;

  console.log("Ung dung Node.js dang lang nghe tai dia chi: http://%s:%s", host, port)
});
