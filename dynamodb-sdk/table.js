const AWS = require('aws-sdk')
const uuidv4 = require('uuid/v4')

class Table {
    constructor(table_name) {
        this._table_name = table_name
        this._dynamodb_client = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" })
    }

    getRecords(params) {
        params["TableName"] = this._table_name
        return this._dynamodb_client.scan(params).promise()
    }

    getRecordById(id) {
        const params = this._getParamsForGetRecordById(id)
        return this._dynamodb_client.get(params).promise()
    }

    _getParamsForGetRecordById(id, attributes_to_get) {
        const params = this._getSubParamsWithIdAndTableName(id)
        
        if (attributes_to_get) {
            params.AttributesToGet = attributes_to_get
        }

        return params
    }

    insertRecord(data) {
        const included_id_data = this._injectIdForRecord(data)
        const params = this._getParamsForInsertRecord(included_id_data)
        
        return this._dynamodb_client.put(params).promise().then(() => {
            return included_id_data
        })
    }

    _getParamsForInsertRecord(included_id_data) {
        const params = {
            TableName: this._table_name,
            Item: included_id_data,
            ReturnValues: "ALL_OLD"
        }

        return params
    }

    _injectIdForRecord(record) {
        const id = this._randomId()
        const included_id_record = Object.assign({id: id}, record)

        return included_id_record
    }

    _randomId() {
        return uuidv4()
    }

    deleteRecordById(id) {
        const params = this._getParamsForDeleteRecordById(id)
        return this._dynamodb_client.delete(params).promise()
    }

    _getParamsForDeleteRecordById(id) {
        const params = this._getSubParamsWithIdAndTableName(id)
        return params
    }

    updateRecordById(id, new_data) {
        const params = this._getParamsForUpdateRecordById(id, new_data)
        return this._dynamodb_client.update(params).promise()
    }

    _getParamsForUpdateRecordById(id, new_data) {
        const params = this._getSubParamsWithIdAndTableName(id)
        const update_expression = this._getUpdateExpressionForUpdateRecordById(new_data)
        const expression_attribute_names = this._getExpressionAttributeNamesForUpdateRecordById(new_data)
        const expression_attribute_values = this._getExpressionAttributeValuesForUpdateRecordById(new_data)

        params.UpdateExpression = update_expression
        params.ExpressionAttributeNames = expression_attribute_names
        params.ExpressionAttributeValues = expression_attribute_values
        params.ReturnValues = "ALL_NEW"

        return params
    }

    _getUpdateExpressionForUpdateRecordById(new_data) {
        return "set " + Object.keys(new_data).map(key => `#${key}=:${key}`).join(",")
    }

    _getExpressionAttributeNamesForUpdateRecordById(new_data) {
        const result = {}
        Object.keys(new_data).forEach(key => {
            result[`#${key}`] = key
        })

        return result
    }

    _getExpressionAttributeValuesForUpdateRecordById(new_data) {
        const result = {}
        Object.keys(new_data).forEach(key => {
            result[`:${key}`] = new_data[key]
        })

        return result
    }

    deleteRecordsByIds(ids) {
        const params = this._getParamsForDeleteRecordsByIds(ids)
        return this._dynamodb_client.batchWrite(params).promise()
    }

    _getParamsForDeleteRecordsByIds(ids) {
        const request_items = {}
        request_items[this._table_name] = ids.map(id => {
            return {
                DeleteRequest: {
                    Key: {
                        id: id
                    }
                }
            }
        })
        const params = {
            RequestItems: request_items,
            ReturnConsumedCapacity: "TOTAL"
        }

        return params
    }

    insertRecords(records) {
        const params = this._getParamForInsertRecords(records)
        return this._dynamodb_client.batchWrite(params).promise()
    }

    _getParamForInsertRecords(records) {
        const included_id_records = records.map(record => this._injectIdForRecord(record))
        const request_items = {}
        request_items[this._table_name] = included_id_records.map(included_id_record => {
            return {
                PutRequest: {
                    Item: included_id_record
                }
            }
        })

        const params = {
            RequestItems: request_items,
            ReturnConsumedCapacity: "TOTAL"
        }

        return params
    }

    _getSubParamsWithIdAndTableName(id) {
        const params = {
            TableName: this._table_name,
            Key: {
                id: id
            }
        }

        return params
    }
}

module.exports = Table