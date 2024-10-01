import { ObjectType, Field } from '@nestjs/graphql';

// Define the Transaction Type
@ObjectType()
export class TransactionType {
    @Field()
    name: string;
}

// Define the Transaction Status
@ObjectType()
export class TransactionStatus {
    @Field()
    name: string;
}

// Define the Transaction
@ObjectType()
export class Transaction {
    @Field()
    transactionExternalId: string;

    @Field(() => TransactionType)
    transactionType: TransactionType;

    @Field(() => TransactionStatus)
    transactionStatus: TransactionStatus;

    @Field()
    value: number;

    @Field()
    createdAt: string;
}
