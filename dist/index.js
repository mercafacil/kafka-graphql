"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphqlHandler = void 0;
const lodash_1 = __importDefault(require("lodash"));
const graphql_1 = require("graphql");
class GraphqlHandler {
    constructor(schema, operations, args, context) {
        this.schema = schema;
        this.operations = operations;
        this.args = args;
        this.context = context;
    }
    resolveVariablesValues(value) {
        return Object.entries(this.args).reduce((acc, [k, v]) => ({ ...acc, [k]: lodash_1.default.get(value, v) }), {});
    }
    async run(topic, message) {
        const variablesValues = this.resolveVariablesValues(JSON.parse(message.value.toString()));
        const result = await graphql_1.graphql(this.schema, this.operations[topic], null, this.context(variablesValues), variablesValues);
        if (result.data)
            console.log(JSON.stringify(result.data, null, 2));
        if (result.errors)
            console.log(JSON.stringify(result.errors, null, 2));
        return Boolean(!result.errors);
    }
}
exports.GraphqlHandler = GraphqlHandler;
