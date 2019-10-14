import DB from './database';

const db = new DB("abcde123456");
const usersTable = db.getTable("usersTable");

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

// usersTable.deleteRecordById("f28f6c4d-7f6a-41cb-b3b4-54283f5f8e62")
// .then(data => {
//     console.log(data)
// })

// usersTable.deleteRecordsByIds(["2c3f0363-306c-471b-aab0-ec63f0fb772e", "56a1e98d-0227-457b-965d-7a2867db57f5"])
// .then(data => console.log(data))

usersTable.updateRecordById("c2fd5f1f-6553-471a-8196-8955b30d27d1", {
    username: "QQQQQQ"
}).then(data => console.log(data))

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



