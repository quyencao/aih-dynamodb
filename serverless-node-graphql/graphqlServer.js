const { ApolloServer } = require("apollo-server-lambda");
const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();
