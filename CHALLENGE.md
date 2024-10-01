
# Project Overview

This repository contains two microservices: **fraud-ms** and **transaction-ms**, built using NestJS and GraphQL. The services communicate via Kafka for messaging and utilize PostgreSQL for data storage. The setup is containerized using Docker Compose.

## Key Features:
- **Kafka Messaging**: Communication between the microservices using Kafka.
- **Prisma ORM**: Interaction with PostgreSQL databases.
- **Redis and Bull**: Used for implementing a throttler for processing high volumes of transactions.
- **Rate Limiting**: Transactions are rate-limited using a queue system managed by Bull. We limit transaction processing to 5 requests every 1 minute to handle high traffic **(only for practical purposes of the project)**.

## Microservices

### 1. Transaction Service (transaction-ms)

The **transaction-ms** microservice handles transaction-related operations, including creating and retrieving transactions.

#### GraphQL Schema
- **Transaction**:
  - `id`: Unique identifier for the transaction.
  - `accountExternalIdDebit`: Account ID of the sender.
  - `accountExternalIdCredit`: Account ID of the receiver.
  - `transferTypeId`: Type of transfer.
  - `value`: Amount of the transaction.
  - `status`: Status of the transaction.
  - `createdAt`: Timestamp of creation.
  - `updatedAt`: Timestamp of the last update.

#### Queries
- `getTransactionByExternalId`: Fetches a transaction by its ID.

#### Mutations
- `createTransaction`: Creates a new transaction.

### 2. Fraud Service (fraud-ms)

The **fraud-ms** microservice is responsible for detecting potential fraudulent transactions.

### Architecture Overview

- **Kafka**: Message broker used for communication between microservices.
- **PostgreSQL**: Database used to store transactions.
- **Redis**: Cache to improve performance (optional).
- **Docker**: Containerization of the services for easy deployment and scalability.

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine.
- Node.js and npm (for local development).

### Directory Structure

```
.
├── docker-compose.yml
├── fraud-ms
│   ├── Dockerfile
│   └── ... (other fraud-ms files)
├── transaction-ms
│   ├── Dockerfile
│   └── ... (other transaction-ms files)
```

### Docker Compose Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Navigate to the Project Directory**:
   Ensure you're in the root directory of the project where the `docker-compose.yml` file is located.

3. **Build and Start Services**:
   Run the following command to start the services defined in `docker-compose.yml`:
   ```bash
   docker-compose up --build
   ```

4. **Access GraphQL Playground**:
   After the services are up, you can access the GraphQL playground for each service at the following URLs:
   - Transaction Service: [http://localhost:3000/graphql](http://localhost:3000/graphql)
   - Fraud Service id not visible because is a nano-service utility

### Sample Queries

**Transaction Service**:
- Create a transaction:
  ```graphql
  mutation {
    createTransaction(createTransactionInput: {
      accountExternalIdDebit: "123",
      accountExternalIdCredit: "456",
      transferTypeId: "1",
      value: 500,
      status: "pending"
    }) {
      id
      value
      status
    }
  }
  ```

### Stopping the Services

To stop the services, you can use:
```bash
docker-compose down
```

### Troubleshooting

- Ensure Docker is running before executing `docker-compose up`.
- Check logs for any errors during the startup process:
  ```bash
  docker-compose logs
  ```

## Conclusion

You now have a basic setup for two microservices using Docker Compose, which communicate via Kafka and store data in PostgreSQL. You can extend these services as needed to implement additional features.

For more detailed information on each microservice, refer to their respective documentation.


### Throttler and Rate Limiting with Bull
In this project, we implemented a throttler to handle multiple transactions effectively. Given the high volume of transactions, we utilized Redis and Bull to queue and process requests. The system limits the processing to 5 requests every 1 minute.

By leveraging Bull queues, if the limit is exceeded, the requests are queued and processed later. This prevents overloading the services during peak traffic.

To configure this feature, Bull is integrated with Redis to handle background jobs and rate-limit them as needed.

