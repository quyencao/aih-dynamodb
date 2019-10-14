const db = require("../dbClient");

const resolver = {
    Mutation: {
        createTodo: () => {
            const params = {
                TableName: "todosTable",
                Item: {
                    "id": "2",
                    "text": "todo 1",
                    "completed": true
                }
            }

            const putItemPromise = db.put(params).promise();

            return putItemPromise.then(function() {
                return {
                    id: 1,
                    text: "todo 2",
                    completed: false
                }
            })
            .catch(err => {
                throw err;
            });

        }
    }
}

module.exports = resolver;