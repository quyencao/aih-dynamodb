import json
from database import Database

if __name__ == "__main__":
    db = Database("abcde123456")
    # todosTable = db.getTable("todosTable")

    # records = todosTable.getRecords({})
    # print(json.dumps(records, indent=2))

    # record = todosTable.getRecordById("470637a4-9a28-4d14-8f18-96afb137f05f")
    # print(json.dumps(record, indent=2))

    # record = todosTable.insertRecord({
    #     "text": "new todo 2",
    #     "completed": False
    # })

    # print(record)

    # result = todosTable.deleteRecordById("320263db-6847-4d55-8e64-e0687dc151c8")

    # print(result)

    # result = todosTable.deleteRecordsByIds(["cd6823ae-acd4-4ae0-acf6-056e67bcc99c", "470637a4-9a28-4d14-8f18-96afb137f05f"])
    # print(result)

    # result = todosTable.insertRecords([
    #     {
    #         "text": "new todo 999",
    #         "completed": False
    #     },
    #     {
    #         "text": "new todo 888",
    #         "completed": True
    #     }
    # ])

    # print(result)

    # result = todosTable.updateRecordById("d2776df8-0958-49bb-bbd6-b200d78ce995", {
    #     "text": "update todo 123456!!!!!",
    #     "completed": False
    # })

    # print(result)

    # result = db.listTables()

    # print(result)