const express = require('express');
const app = express();

const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');

const { sentencias } = require('./data.json');

const schema = buildSchema(`
    type Query {
        sentencia(id: Int!): Sentencia
        sentencias(materia: String): [Sentencia]
    }
    type Mutation {
        updateSentencia(id: Int!, materia: String): Sentencia
    }
    type Sentencia {
        id: Int
        organo: String
        fecha: String
        materia: String
        resumen: String
        pdf: String
    }

`);

let getSentencia = (args) => {
    let id = args.id;
    return sentencias.filter(sentencia => {
        return sentencia.id == id
    })[0]
}

let getSentencias = (args) => {
    if(args.materia) {
        let materia = args.materia;
        return sentencias.filter(sentencia => sentencia.materia === materia)
    } else {
        return sentencias
    }
}; 

let updateSentencia = ({id, materia}) => {
    sentencias.map(sentencia => {
        if(sentencia.id === id) {
            sentencia.materia = materia;
            return sentencia
        }
    })
    return sentencias.filter(sentencia => sentencia.id === id) [0];
}
const root = {
    sentencia: getSentencia,
    sentencias: getSentencias,
    updateSentencia: updateSentencia
}
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

app.listen(3000, () => console.log('server on port 3000'));