import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionsModule } from './transactions/transactions.module';
import { DateTimeResolver } from 'graphql-scalars';
import { join } from "path";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      playground: true,
      introspection: true,
      resolvers: { DateTime: DateTimeResolver },
    }),
    TransactionsModule,
  ],
})
export class AppModule {}