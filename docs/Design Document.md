## Project Name: Reservation API

### Features
*What are the main functionalities of the software?*

This API allows for CRUD for Customer, Vehicle, and Reservation per ServiceBay and prevent creating conflicting reservations.

### Architecture 
*How is the system structured, and what are its key components?*

#### Technologies
- TypeScript
- Node.js
- SQLite
- [Express](https://expressjs.com/) for web framework 
- [Prisma](https://www.prisma.io/) for DB ORM 
- [Vinejs](https://vinejs.dev/docs/introduction) for request validation
- [Vitest](https://vitest.dev/) for test runner
- [Supertest](https://github.com/ladjs/supertest) for controller testing
- [date-fns](https://date-fns.org/) for date/time manipulations

#### Folder Structure
```sh
prisma/            # prisma/db files
src/
	lib/           # shared code within the project
	routes/        # express routes
	schemas/       # vinejs schemas to validate/parse external data
tests/             # tests
app.js             # express app
main.js            # start express app
.env               # env variables, DATABASE_URL, TZ important
```


### Data Design
*How is data organized and managed within the system?*

The main object in this API are `Customer`, `Vehicle`,  `Reservation`, and `ServiceBay`.

`ServiceBay` has many `Reservation`.

`Customer` has many `Vehicle` and `Reservation`.

Reservation occurs when a new `Reservation` is created with a valid `Customer`, `Vehicle` and `ServiceBay`

For the moment the backend doesn't contain information about working hours or time needed in between reservation giving the frontend the flexibility of implementing those rules (i.e. for "mobile" service bays or to account for seasonal or event-specific extended working hours)

#### `Customer`
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1 (555) 123-4567",
  "street": "123 Main St",
  "city": "Anytown",
  "state": "CA",
  "postalCode": "12345",
  "country": "USA",
  "notes": "Preferred customer, always pays on time"
}
```


#### `Vehicle`
```json
{
  "id": 1,
  "customerId": 123,
  "vin": "1HGCM82633A004352",
  "make": "Honda",
  "model": "Accord",
  "year": 2022,
  "mileage": 15000,
  "lastServiceDate": "2024-05-15T10:30:00Z",
  "nextServiceDue": "2024-11-15T10:30:00Z",
  "notes": "Regular oil change and tire rotation performed during last service."
}
```

#### `ServiceBay`
```json
{
  "id": 1,
  "name": "Servcice Bay 1"
}
```

#### `Reservation`
```json
{
  "id": 1,
  "serviceBayId": 5,
  "customerId": 789,
  "vehicleId": 101,
  "startTime": "2024-11-15T09:00:00Z",
  "endTime": "2024-11-15T11:30:00Z"
}
```


### User Interface
*How will users interact with the software, and what does it look like?*
N/A

### Testing
*What is the strategy for ensuring software quality and reliability?*
1. **Integration Testing**: Controllers are tested as complete units using `supertest`, which allows us to make HTTP calls and ensure the appropriate behavior.
2. **Test Runner**: We utilize `vitest` as our test runner, providing a fast and efficient testing environment that's compatible with modern TypeScript.
3. **Mocking**: Prisma database functions are mocked during testing. This allows us to isolate our tests from the database, ensuring consistent and predictable test results regardless of the database state.
4. **Coverage**: We aim for high test coverage, particularly focusing on critical paths and edge cases within our controllers.
