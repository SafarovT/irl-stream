import { Module } from '@nestjs/common';
import {Neo4jGraphQL} from '@neo4j/graphql'
import * as neo4j from 'neo4j-driver'
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import {typeDefs} from './type-defs'

export const gqlProviderFactory = async () => {

    const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

    const driver = neo4j.driver(
        NEO4J_URI,
        neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
    )

    const neoSchema = new Neo4jGraphQL({
        typeDefs,
        driver,
    })

    const schema = await neoSchema.getSchema()
    await neoSchema.assertIndexesAndConstraints({
        options: {
            create: true,
        },
    })

    return {
        playground: true,
        schema,
    }
}

@Module({
    imports: [
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useFactory: gqlProviderFactory,
        })
    ]
})
export class GqlModule {
}
