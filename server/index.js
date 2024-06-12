const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const {default:axios} = require('axios');

async function startServer() {  
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
        type Todo {
            id: ID!,
            title:String!,
            completed: Boolean
        }

        type Query {
            getTodos: [Todo]
        }
       `,

        resolvers: {    
            Query: {
                getTodos:async () =>await axios.get('https://jsonplaceholder.typicode.com/todos')
                .then(res => res.data)
                .catch(err => console.log(err))
            },
        },
    });

    app.use(cors());
    app.use(bodyParser.json()); 
    await server.start();
    app.use('/graphql', expressMiddleware(server));

    app.listen(4000, () => {
        console.log('Server started on http://localhost:4000/graphql');
    })
   
}

startServer();