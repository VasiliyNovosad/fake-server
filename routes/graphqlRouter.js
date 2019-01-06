const express = require('express');
const router = express.Router();
const graphqlHTTP = require('express-graphql');
const schema = require('../scheme');

router.get('/', graphqlHTTP({ schema, graphiql: true }));

router.post('/', graphqlHTTP({ schema, graphiql: false }));

module.exports = router;
