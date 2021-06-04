import { KafkaMessage } from 'kafkajs'
import { IKafkaHandler, IGenericObject } from '@mercafacil/kafka-client'
import _ from 'lodash'
import { graphql, GraphQLSchema } from 'graphql'

export class GraphqlHandler implements IKafkaHandler {
  schema: GraphQLSchema
  operations: IGenericObject
  args: IGenericObject
  context: (topic: string, msgVariables:IGenericObject) => IGenericObject

  constructor(schema: GraphQLSchema, operations: IGenericObject, args: IGenericObject, context: (topic: string, msgVariables: IGenericObject) => IGenericObject ) {
    this.schema = schema
    this.operations = operations
    this.args = args
    this.context = context
  }

  resolveVariablesValues(value: IGenericObject) {
    return Object.entries(this.args).reduce((acc, [k, v]) => ({ ...acc, [k]: _.get(value, v) }), {})
  }

  async run(topic: string, message: KafkaMessage) {
    const variablesValues: IGenericObject = this.resolveVariablesValues(JSON.parse(message.value!.toString()))

    const result = await graphql(
      this.schema,
      this.operations[topic],
      null,
      this.context(topic, variablesValues),
      variablesValues
    )

    if (result.data) console.log(JSON.stringify(result.data, null, 2))
    if (result.errors) console.log(JSON.stringify(result.errors, null, 2))

    return Boolean(!result.errors)
  }
}
