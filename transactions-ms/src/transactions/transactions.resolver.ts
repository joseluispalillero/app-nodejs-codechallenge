import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { Transaction } from './dto/transaction.dto';
import { TransactionInput } from "./request/transactionInput.type";

@Resolver(() => Transaction) // Specifies the resolver for the TransactionDto type
export class TransactionsResolver {
    constructor(private transactionsService: TransactionsService) {}

    @Query(() => Transaction)
    async getTransactionByExternalId(@Args("id") id: string) {
        return this.transactionsService.getTransactionById(id);
    }

    @Mutation(() => Transaction) // Defines the "createTransaction" mutation
    async createTransaction(
        @Args('transactionInput') transactionInput: TransactionInput
    ) {
        return this.transactionsService.createTransaction(transactionInput);
    }
}
