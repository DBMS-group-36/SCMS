# Supply Chain Management System API

This folder contains the REST and gRPC APIs for the Supply Chain Management System.

## REST API

The REST API is used for managing the supply chain system. It supports the following endpoints:

- `/products`: Returns a list of all products in the system.
- `/products/{id}`: Returns a specific product by ID.
- `/orders`: Returns a list of all orders in the system.
- `/orders/{id}`: Returns a specific order by ID.

## gRPC API

The gRPC API is used for real-time communication between the supply chain system and other systems. It supports the following services:

- `ProductService`: Provides methods for managing products in the system.
- `OrderService`: Provides methods for managing orders in the system.
