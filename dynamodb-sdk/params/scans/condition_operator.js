const ScanParam = require("./scan_param")
const { LogicalOperator } = require("../consts")


class ConditionOperator {
    constructor(table_name) {
        this._table_name = table_name
    }

    and() {
        return new ScanParam(this._table_name, LogicalOperator.$AND)
    }

    or() {
        return new ScanParam(this._table_name, LogicalOperator.$OR)
    }

    only() {
        return new ScanParam(this._table_name, null)
    }
}

module.exports = ConditionOperator