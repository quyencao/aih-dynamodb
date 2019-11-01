const ComparativeClause = require("./comparative_clause")
const { LogicalOperator, ComparisonOperator } = require("./consts")
const AWS = require('aws-sdk')

class QueryParam {
    constructor(table_name) {
        this._table_name = table_name
        this._dynamodb_client = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" })
        this._hash_field_clause = null
        this._index_name = null
        this._range_field_clause = null
        // this._logical_operator = null
        this._limit = null
    }

    eq(key, value) {
        this._doComparisonAssign(key, ComparisonOperator.$EQ, value)
        return this
    }

    lt(key, value) {
        this._doComparisonAssign(key, ComparisonOperator.$LT, value)
        return this
    }

    lte(key, value) {
        this._doComparisonAssign(key, ComparisonOperator.$LTE, value)
        return this
    }

    gt(key, value) {
        this._doComparisonAssign(key, ComparisonOperator.$GT, value)
        return this
    }

    gte(key, value) {
        this._doComparisonAssign(key, ComparisonOperator.$GTE, value)
        return this
    }

    // and() {
    //     this._logical_operator = LogicalOperator.$AND
    //     return this
    // }

    // or() {
    //     this._logical_operator = LogicalOperator.$OR
    //     return this
    // }

    limit(limit) {
        this._limit = limit
        return this
    }

    exec() {
        const query_params = this._getQueryParams()
        console.log(query_params)
        return this._dynamodb_client.query(query_params).promise()
    }

    _doComparisonAssign(key, comparison_operator, value) {
        const comparison_clause = new ComparativeClause(key, comparison_operator, value)
        if (key == "id") {
        // if (key == "field_1") {
            this._hash_field_clause = comparison_clause
        } else {
            this._index_name = key
            this._range_field_clause = comparison_clause
        }
    }

    _getQueryParams() {
        const key_condition_expression = this._getKeyConditionExpressionForGetQueryParams()
        const expression_attribute_values = this._getExpressionAttributeValuesForGetQueryParams()

        const params = {
            TableName: this._table_name,
            KeyConditionExpression: key_condition_expression,
            ExpressionAttributeValues: expression_attribute_values
        }

        if (this._limit) {
            params.Limit = this._limit
        }

        if (this._index_name) {
            params.IndexName = this._index_name
        }

        return params
    }

    _getKeyConditionExpressionForGetQueryParams() {
        const hash_field_clause = this._hash_field_clause
        const range_field_clause = this._range_field_clause
        let filter_expression = `${hash_field_clause.key} ${hash_field_clause.operator} :${hash_field_clause.key}`
        if (range_field_clause) {
            filter_expression = ` ${filter_expression} and ${range_field_clause.key} ${range_field_clause.operator} :${range_field_clause.key}`
        }
        return filter_expression
    }

    _getExpressionAttributeValuesForGetQueryParams() {
        const hash_field_clause = this._hash_field_clause
        const range_field_clause = this._range_field_clause

        const hash_key = hash_field_clause.key
        const hash_value = hash_field_clause.value
        const range_key = range_field_clause.key
        const range_value = range_field_clause.value

        const expression_attribute_values = {}
        expression_attribute_values[`:${hash_key}`] = hash_value
        expression_attribute_values[`:${range_key}`] = range_value

        return expression_attribute_values
    }
}

module.exports = QueryParam