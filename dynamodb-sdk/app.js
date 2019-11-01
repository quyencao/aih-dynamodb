// import DB from './database';
const DB = require('./database')
const QueryParam = require("./params/query_param")

const db = new DB("app");
const table = db.getTable("aih-sdk-test");

// usersTable.insertRecord({
//     username: "quyen",
//     email: "quyen@email.com"
// }).then((data) => {
//     console.log(data)
// }).catch((e) => {
//     console.log(e)
// })

// usersTable.getRecordById("56a1e98d-0227-457b-965d-7a2867db57f5")
// .then((data) => {
//     console.log(data)
// })
// .catch(err => {
//     console.log(err)
// })

// usersTable.deleteRecordById("f28f6c4d-7f6a-41cb-b3b4-54283f5f8e62")
// .then(data => {
//     console.log(data)
// })

// usersTable.deleteRecordsByIds(["2c3f0363-306c-471b-aab0-ec63f0fb772e", "56a1e98d-0227-457b-965d-7a2867db57f5"])
// .then(data => console.log(data))

// usersTable.updateRecordById("c2fd5f1f-6553-471a-8196-8955b30d27d1", {
//     username: "QQQQQQ"
// }).then(data => console.log(data))

// db.listTables("", 3)
// .then(data => console.log(data))
// .catch(err => console.log(err))

// usersTable.insertRecord({
//     username: "quyen",
//     email: "quyen@email.com"
// }).then((data) => {
//     console.log(data)
// }).catch((e) => {
//     console.log(e)
// })


// const params = {
//     TableName: 'Table',
//     KeyConditionExpression : 'id = :id',
//     ExpressionAttributeValues : {':id' : 'id_001'},
//     // IndexName: 'field_1',
//     Limit: 2,
// };

// const params = { TableName: 'app_aih-sdk-test',
// KeyConditionExpression: ' id >= :id and f_1 = :field_1',
// ExpressionAttributeValues: { ':id': 'f1-001', ':field_1': 'f1-001' },
// Limit: 1,
// IndexName: 'f_1' }

// const params = {
//     TableName: 'Table',
//     ScanFilter : {
//     // ScanFilter: {
//         'id': {
//             ComparisonOperator: "EQ",
//             AttributeValueList: ["id_001"]
//         },
//         'field_1': {
//             ComparisonOperator: "IN",
//             AttributeValueList: ["field_1_001", "field_1_002"]
//         },
//         'field_2': {
//             ComparisonOperator: "IN",
//             AttributeValueList: ["field_2_001", "field_2_002"]
//         }
//     },
//     ConditionalOperator: "and"
// };

// table.getRecords(params).then(data => {
//     console.log(data)
// })

// class Test{
//     query() {
//         this.query = new QueryParam()
//         return this.query
//     }

//     exec() {
//         return this.query
//     }
// }

// // const x = new QueryParam().useHashKey("field_1", "le", "1").or().useRangeKey("field_1", "le", "1")
// // x._hash_field_clause = 1

// // console.log(x)

// test = new Test()

// test.query().useHashKey("field_1", "le", "1").or().useRangeKey("field_1", "le", "1").e
// console.log(test.exec())


// function test() {
//     return new QueryParam()
// }

// x = test().useHashKey("field_1", "le", "1").or().useRangeKey("field_1", "le", "1")
// console.log(x)

// x = new QueryParam()
// x._hash_field_clause = 1
// console.log(x)

// table.query().gte("id", "f1-001").lt("f_1", "f1-001").limit(1).exec().then(data => {
//     console.log(data)
// })

table.scan().only().eq("id", ["id_001"]).gt("field_1", ["field_1_001"]).limit(2).exec().then(data => {
    console.log(data)
})