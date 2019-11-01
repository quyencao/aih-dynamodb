const ComparativeClause = require("../comparative_clause")
const { LogicalOperator, ScanComparisonOperator } = require("../consts")
const AWS = require('aws-sdk')

class ScanParam {
    constructor(table_name, condition_operator) {
        this._table_name = table_name
        this._dynamodb_client = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" })
        this._clauses = []
        this._condition_operator = condition_operator
    }

    eq(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$EQ, value)
        return this
    }

    ne(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$NE, value)
        return this
    }

    in(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$IN, value)
        return this
    }

    le(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$LE, value)
        return this
    }

    lt(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$lT, value)
        return this
    }

    ge(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$GE, value)
        return this
    }

    gt(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$GT, value)
        return this
    }

    between(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$BETWEEN, value)
        return this
    }

    notNull(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$NOT_NULL, value)
        return this
    }

    null(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$NULL, value)
        return this
    }

    contains(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$CONTAINS, value)
        return this
    }

    notContains(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$NOT_CONTAINS, value)
        return this
    }

    beginWith(key, value) {
        this._doComparisonAssign(key, ScanComparisonOperator.$BEGINS_WITH, value)
        return this
    }

    limit(limit) {
        this._limit = limit
        return this
    }

    exec() {
        const query_params = this._getScanParams()
        return this._dynamodb_client.scan(query_params).promise()
    }

    _doComparisonAssign(key, comparison_operator, value) {
        const comparison_clause = new ComparativeClause(key, comparison_operator, value)
        this._clauses.push(comparison_clause)
    }

    _getScanParams() {
        const scan_filter = this._getScanFilterForGetScanParams()

        const params = {
            TableName: this._table_name,
            ScanFilter: scan_filter,
            ConditionalOperator: this._condition_operator
        }

        if (this._condition_operator) {
            params.ConditionalOperator = this._condition_operator
        }

        if (this._limit) {
            params.Limit = this._limit
        }

        return params
    }

    _getScanFilterForGetScanParams() {
        const scan_filter = {}
        this._clauses.forEach(comparison_clause => {
            const { key, operator, value } = comparison_clause
            scan_filter[key] = {
                ComparisonOperator: operator,
                AttributeValueList: value
            }
        })

        return scan_filter
    }
}

module.exports = ScanParam