
const schema = require('./schema').schema;
const getUsersResolvers = require('./resolver').getUsersResolvers
const createBooks = require('./resolver').createBooks
const getBookByTitle = require('./resolver').getBookByTitle
const deleteBYtitle = require('./resolver').deleteBYtitle
const updateBookOnTitle = require('./resolver').updateBookOnTitle



const {graphql} = require('graphql');
const myFuncs = require('./common_function');
const productField = ['bookId','title','author','publishdate','price']
var AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-1" });
var docClient = new AWS.DynamoDB.DocumentClient();

// get all books
module.exports.getAllBook = async (event, context, callback) => {
    let query;
    let key;
    // key = event.queryStringParameters
    // key = event.queryStringParameters.startDate

    // console.log("que,...",event.queryStringParameters);
    if(event.queryStringParameters){
        // query = myFuncs.queryBuilder('getBookOnPrice',productField,{'price' : `"${event.queryStringParameters.price}"` })
        // query = myFuncs.queryBuilder('getBookOnDate',productField,{'startDate' : `"${event.queryStringParameters.startDate}"`,'endDate' : `"${event.queryStringParameters.endDate}"`})
        // query = myFuncs.queryBuilder('getBookOnTitltAuthor',productField,{'title' : `"${event.queryStringParameters.title}"`,'author' : `"${event.queryStringParameters.author}"`})
        // query = myFuncs.queryBuilder('searchingBook',productField,{'search' : `"${event.queryStringParameters.search}"`});
        query = myFuncs.queryBuilder('filteringBook',productField,{'title' : `"${event.queryStringParameters.title}"`,'author' : `"${event.queryStringParameters.author}"`,'search' : `"${event.queryStringParameters.search}"`});


    }else{
        query = myFuncs.queryBuilder('getBook',productField)
    }

    
    const result = await graphql(schema,query,getUsersResolvers)
    console.log("re/....",result);
    return myFuncs.createRes(200, result.data)
}

// create a new book
module.exports.AddBook = async (event) =>{
    try {
        const data =JSON.parse(event.body)  
        const query = ` mutation { addBook(bookId : "${data.bookId}",title : "${data.title}", author: "${data.author}",publishdate : "${data.publishdate}",price : "${data.price}" ) {bookId title author publishdate price}}`
        const result = await graphql(schema,query,createBooks)
        console.log("resu..",result);
        return myFuncs.createRes(200, result.data)
    } catch (e) {
        console.log("e..",e);
    }
}
// get book by title
module.exports.getBook = async event => {
    try {
        let query = myFuncs.queryBuilder('getBookById',productField,{'title':`"${event.queryStringParameters.title}"`})
        let result = await graphql(schema,query,getBookByTitle)
        return myFuncs.createRes(200, result)
    } catch (e) {
        console.log("e...",e);
    }
}

module.exports.deleteBookByTitle = async event => {
    try {
    
        let query = `mutation { deleteBook(title : "${event.queryStringParameters.title}",author : "${event.queryStringParameters.author}" ) {title author}}`
        let result = await graphql(schema,query,deleteBYtitle);
        return myFuncs.createRes(200,result);

    } catch (e) {
        console.log("e..",e);
    }
}

module.exports.updateBookByTitle = async event => {
    const data = JSON.parse(event.body)
    console.log(data);
    try {
        let query = ` mutation {updateBook(title : "${event.queryStringParameters.title}",author : "${data.author}"){title author}}`
        let result = await graphql(schema,query,updateBookOnTitle);
        console.log("resss....",result);
    } catch (e) {
        console.log("e..",e);
    }
}