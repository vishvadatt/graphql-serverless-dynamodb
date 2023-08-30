const {buildSchema} = require('graphql');

module.exports.schema = buildSchema(`
    scalar JSON

    type Book {
        bookId : String
        title : String
        author : String
        publishdate : String
        price : String
    }


    type Query {
        getBook : [Book] 
        getBookById(title : String) : [Book]
        getBookOnPrice(price : String) : [Book]
        getBookOnDate(startDate : String, endDate : String) : [Book]
        getBookOnTitltAuthor(title : String, author : String) : [Book]
        searchingBook(search : String) : [Book]
        filteringBook(title : String, author : String,search : String) : [Book]

    }

    type Mutation {
        addBook(bookId : String,title : String, author : String,publishdate : String,price : String) : Book
        deleteBook(title : String, author : String): Book
        updateBook(title : String, author : String): Book
    }
`)