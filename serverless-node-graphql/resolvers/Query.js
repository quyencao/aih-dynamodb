const db = require("../dbClient");

const resolver = {
    Query: {
        getTodos: () => {
            const params = {
                TableName: "todosTable"
            };

            const getItems = db.scan(params).promise();

            return getItems.then(data => {
                return data.Items;
            })
            .catch(err => {
                throw err;
            });
        }
    }
}

module.exports = resolver;