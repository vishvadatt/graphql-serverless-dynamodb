const createRes = (statusCode, body) => {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: (JSON.stringify(body)),
    };
}

const queryBuilder = (queryModel, responseFields, queryInput = null) => {
    let query

    if (!queryInput) query = `{${queryModel} {`
    else {
        query = `{${queryModel}(`
        Object.keys(queryInput).map(key => {
            query += `${key}: ${queryInput[key]},`
        })
        query = query.substr(0, query.length - 1)
        query += '){'
    }

    responseFields.map(field => {
        query += ` ${field}`
    })
    query += '}}'
    return query
}

module.exports = {
    createRes,
    queryBuilder,
}
