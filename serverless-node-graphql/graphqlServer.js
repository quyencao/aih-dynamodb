const { ApolloServer } = require("apollo-server-lambda");
const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const server = new ApolloServer({ 
	typeDefs, 
	resolvers,
	playground: {
		settings: {
			'editor.theme': 'light',
		},
		tabs: [
			{
				endpoint: "/dev/graphql"
			}
		]
	}
});

exports.graphqlHandler = server.createHandler();
