import { Transaction as TransactionData } from "@prisma/client";
import { Transaction } from "../dto/transaction.dto";

const transactionTypeName = {
    1: "DEBIT",
    2: "CREDIT",
};

export const mapTransaction = (
    transactionData: TransactionData
): Transaction => {
    return {
        transactionExternalId: transactionData.id,
        transactionType: {
            name: transactionTypeName[transactionData.transferTypeId],
        },
        transactionStatus: {
            name: transactionData.status,
        },
        value: transactionData.value,
        createdAt: transactionData.createdAt.toString(),
    };
};