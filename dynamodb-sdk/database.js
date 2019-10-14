const AWS = require('aws-sdk')
const Table = require('./table')

class Database {
    constructor(app_id) {
        this._prefix = `${app_id}_`
        this._dynamodb = new AWS.DynamoDB({ region: "us-east-1" })
    }

    getTable(table_name) {
        const real_table_name = this._prefix + table_name
        return new Table(real_table_name)
    }

    listTables(exclusive_start_table_name, limit) {
        const params = this._getParamsForListTables(exclusive_start_table_name, limit)
        return this._dynamodb.listTables(params).promise()
    }

    _getParamsForListTables(exclusive_start_table_name, limit) {
        const prefix = this._prefix + exclusive_start_table_name || ""
        const params = {
            ExclusiveStartTableName: prefix,
            Limit: limit
        };
        return params
    }
}

module.exports = Database