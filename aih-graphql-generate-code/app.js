const path = require('path');
const fs = require("fs")

const dataFilePath = process.argv.length > 2 ? process.argv[2] : './data.json';
const data = require(path.join(process.cwd(), dataFilePath));
const { printSchema } = require('graphql');
const getSchemaFromData = require('./lib/introspection/getSchemaFromData').default;
const resolver = require("./lib/resolver").default;
const schema = printSchema(getSchemaFromData(data))
const resolverObj = resolver(data)

fs.writeFile("schema.graphql", schema, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
});
