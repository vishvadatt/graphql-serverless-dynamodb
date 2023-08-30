var AWS = require("aws-sdk")
// AWS.config.update({region : "eu-west-1"});

AWS.config.update({
    region : "eu-west-1",
    //  accessKeyId : process.env.AWS_ACCESS_KEY,
    //  secretAccessKey : process.env.AWS_SECRET_KEY,
    endpoint : "http://localhost:8000"
});
var docClient = new AWS.DynamoDB.DocumentClient();



module.exports.getUsersResolvers = {
    getBook: async({price}) =>{
        let params;
            console.log("..............");
            params = {
                TableName: 'book',
                // PageSize : 3
                // Page : 1,
                
                // Limit : 3,
                // offset : 2,
                // nextToken : 2
            };
            
        let data = await docClient.scan(params).promise()
        // if(data.LastEvaluatedKey){

        // }
        console.log("data...",data);
        return data.Items
    },
    getBookOnPrice: async ({price}) =>{
    
        params = {
            TableName: 'book', 
            FilterExpression : '#price = :price_val',
            ExpressionAttributeNames:{
                "#price" : "price"  
            },
            ExpressionAttributeValues:{
                ":price_val" : price
            }
        }
        let data = await docClient.scan(params).promise();
        console.log("data...",data);
        return data.Items
    },

    getBookOnDate: async ({startDate,endDate}) =>{
        console.log("date wise");
        params = {
            TableName: 'book',
            // KeyConditionExpression:'#publishdate BETWEEN :startDate AND :endDate',
            FilterExpression : '#publishdate BETWEEN :startDate AND :endDate',
            ExpressionAttributeNames:{
                "#publishdate" : "publishdate"  
            },
            ExpressionAttributeValues:{
                ":startDate" : startDate,
                ":endDate" : endDate
            }
        };
        let data = await docClient.scan(params).promise();
        console.log("data...",data);
        return data.Items
    },

    getBookOnTitltAuthor : async ({title,author}) =>{
        params = {
            TableName: 'book',
            // KeyConditionExpression:'#publishdate BETWEEN :startDate AND :endDate',
            FilterExpression : '#title = :title AND #author = :author',
            ExpressionAttributeNames:{
                "#title" : "title",
                "#author" : "author"  
            },
            ExpressionAttributeValues:{
                ":title" : title,
                ":author" : author
            }
        };
        let data = await docClient.scan(params).promise();
        console.log("data...",data);
        return data.Items
    },

    searchingBook:async ({search}) =>{
        params = {
            TableName: 'book',
            FilterExpression : 'contains(#title,:title_val) OR contains(#author,:author_val) OR contains(#price,:price_val)',
            ExpressionAttributeNames:{
                "#title" : "title",
                "#author" : "author",
                "#price" : "price",  
            },
            ExpressionAttributeValues:{
                ":title_val" : search,
                ":author_val" : search,
                ":price_val" : search
            }
        };
        let data = await docClient.scan(params).promise();
        console.log("data...",data);
        return data.Items
    },
    filteringBook: async ({title,author,search}) =>{
        params = {
            TableName: 'book',
            FilterExpression : '(#author = :author_val) OR (#title = :title_val) OR contains(#price,:search_val) OR contains(#author,:search_val) OR contains(#title,:search_val)',
            ExpressionAttributeNames:{
                "#title" : "title",
                "#author" : "author",
                "#price" : "price"
            },
            ExpressionAttributeValues:{
                ":search_val" : search,
                ":title_val" : title,
                ":author_val" : author
            }
        };
        let data = await docClient.scan(params).promise();
        console.log("data...",data);
        return data.Items 
    }
}

module.exports.createBooks = {
    addBook: async ({bookId,title,author,publishdate,price}) =>{
        console.log("bookid",bookId);
        const params = {
            TableName : 'book',
            Item: {
                bookId : bookId,
                title : title,
                author : author,
                publishdate : publishdate,
                price : price
            },
            ReturnValues: 'ALL_OLD',
        };
    
        let data = await docClient.put(params).promise()
        console.log("data....",data);
        return data
    }
}

module.exports.getBookByTitle = {
    getBookById: async ({ title}) => {
        let params = {
            TableName: 'book',
            FilterExpression: "#title = :title_val",
            ExpressionAttributeNames: {
                "#title": "title"
            },
            ExpressionAttributeValues: {
                ":title_val": title
            }
        };
        const items = await docClient.scan(params).promise();
        console.log("itemmm..",items.Items);
        return items.Items
    }
}

module.exports.deleteBYtitle = {
    deleteBook: async({title,author}) =>{
        console.log("t.....",title);
        let params = {
            TableName : 'book',
            Key : {
                "title": title,
                "author": author
            }
        }
        const deleteItem = await docClient.delete(params).promise();
        console.log("deleteItem",deleteItem);
        return deleteItem
    }
}

module.exports.updateBookOnTitle = {
    updateBook: async ({title,author}) =>{
        console.log("auth...",author);
        var params = {
            TableName: 'book',
            Key: {
                "title": title,
                // "author":author
            },
            UpdateExpression: "set #author = :author_val",
            ExpressionAttributeNames: {
                "#author": "author",
                // '#title' : "title"
            },
            ExpressionAttributeValues: {
                ":author_val": author
            },
            ReturnValues: "UPDATED_NEW"
        };
        let data = await docClient.update(params).promise()
        console.log("data....",data);
        return data
    }
}