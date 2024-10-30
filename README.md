# Reservation API Project

This project is a reservation API for managing customers, vehicles, and service bay reservations.

## Getting Started

### Prerequisites

-   Node.js v22
-   SQLite 3

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Database Setup

To set up and reset the database, run:

```bash
npm run db:reset
```

Note: By default, 3 service bays are seeded in the project. You can find this configuration in `prisma/seed.ts`.

### Running Tests

To run the test suite, use:

```bash
npm test
```

### Starting the Server

To start the API server, run:

```bash
npm start
```

## API Endpoints

```
GET    /customer        # list costumers
GET    /customer/:id    # fetch customer by id
POST   /customer        # create customer
PATCH  /customer/:id    # update customer
DELETE /customer/:id    # delete customer


GET    /vehicle         # list vehicles
GET    /vehicle/:id     # fetch vehicle by id
POST   /vehicle         # create vehicle
PATCH  /vehicle/:id     # update vehicle
DELETE /vehicle/:id     # delete vehicle


GET    /reservation                         # list reservations
GET    /reservation/by-service-bay/:id      # list reservation by service bay
GET    /reservation/:id                     # fetch reservation by id
POST   /reservation                         # create reservation
PATCH  /reservation/:id                     # update reservation
DELETE /reservation/:id                     # delete reservation
```

## API Usage

Before running the examples, ensure that your API server is up and running on `http://localhost:3000`.

**Tip**: pipe the output of the `curl` command through `jq` for nicer JSON output.

```bash
curl http://localhost:3000/customer | jq
```

Here are some examples of how to use the API with curl:

### Create a Customer

```bash
curl --request POST \
     --url http://localhost:3000/customer \
     --header 'content-type: application/json' \
     --data '
		{
			 "firstName": "John",
			 "lastName": "Doe",
			 "email": "john.doe@example.com",
			 "phoneNumber": "+1 (555) 123-4567",
			 "street": "123 Main St",
			 "city": "Anytown",
			 "state": "CA",
			 "postalCode": "12345",
			 "country": "USA",
			 "notes": "Preferred customer"
		}
	'
```

### Create a Vehicle

```bash
curl --request POST \
     --url http://localhost:3000/vehicle \
     --header 'content-type: application/json' \
     --data '
	     {
			 "customerId": 1,
			 "vin": "1HGCM82633A004352",
			 "make": "Honda",
			 "model": "Accord",
			 "year": 2022,
			 "mileage": 15000,
			 "lastServiceDate": null,
			 "nextServiceDue": null,
			 "notes": "Regular oil change and tire rotation performed during last service."
		}
	'
```

### Create a Reservation

```bash
curl --request POST \
     --url http://localhost:3000/reservation \
     --header 'content-type: application/json' \
     --data '
		 {
			 "serviceBayId": 1,
			 "customerId": 1,
			 "vehicleId": 1,
			 "startTime": "2024-11-15 09:00:00",
			 "endTime": "2024-11-15 11:30:00"
		}
	'
```

Important: This command can only be executed once with the given time parameters. Attempting to run it again will result in an error due to a conflict with the existing reservation. To create additional reservations, you must modify the `startTime` and `endTime` values to avoid overlapping with previously entered time slots.

### Get Customers

To retrieve a list of customers, you can use the following GET request:

```bash
curl http://localhost:3000/customer
```

This request will return a JSON array of customer objects.

### Get a Specific Customer

To retrieve a specific customer by ID, use:

```bash
curl http://localhost:3000/customer/1
```

Replace `1` with the actual customer ID you want to fetch.

### Get Vehicles

To retrieve a list of vehicles, use:

```bash
curl http://localhost:3000/vehicle
```

### Get a Specific Vehicle

To retrieve a specific vehicle by ID, use:

```bash
curl http://localhost:3000/vehicle/1
```

Again, replace `1` with the actual vehicle ID you want to fetch.

### Get Reservations

To retrieve a list of reservations, use:

```bash
curl http://localhost:3000/reservation
```

### Get a Specific Reservation

To retrieve a specific reservation by ID, use:

```bash
curl http://localhost:3000/reservation/1
```

Replace `1` with the actual reservation ID you want to fetch.

### Get Reservations by ServiceBay

To retrieve a list of reservations by service bay, use:

```bash
curl http://localhost:3000/reservation/by-service-bay/1
```

Replace `1` with the actual service bay ID you want to fetch.
