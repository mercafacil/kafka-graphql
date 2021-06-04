import { KafkaMessage } from 'kafkajs';
import { IKafkaHandler, IGenericObject } from '@mercafacil/kafka-client';
import { GraphQLSchema } from 'graphql';
export declare class GraphqlHandler implements IKafkaHandler {
    schema: GraphQLSchema;
    operations: IGenericObject;
    args: IGenericObject;
    context: (topic: string, msgVariables: IGenericObject) => IGenericObject;
    constructor(schema: GraphQLSchema, operations: IGenericObject, args: IGenericObject, context: (topic: string, msgVariables: IGenericObject) => IGenericObject);
    resolveVariablesValues(value: IGenericObject): {};
    run(topic: string, message: KafkaMessage): Promise<boolean>;
}
