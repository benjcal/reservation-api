
## Project Name: Reservation API

## Project Purpose
*Why are we doing this project?*
This project aims to create the backend/API portion of a solution to allow St Charles Automotive to perform reservations for customer vehicle's repairs/maintenance over the phone.

## Description
*How would you describe this project?*
The API will be a Node.js application that exposes a clean REST-like API endpoints that the frontend team can to create an app that allows agents at St Charles Automotive to capture **customer** information, **vehicle** information and reserve a **time slot** in one of the available service **bays** at the dealership.

The project will ensure that no double-booking occurs, that customer/vehicle/time availability information is easily accessible, and implement sound engineering practices to build a secure and robust solution.

## Desired Results
*What specific outcomes must we achieve  to be successful?*
To develop a robust API that efficiently captures customer, vehicle, and reservation information while preventing double bookings.

## Priorities
### Time
*When is the project due?*
**11/1/2024**

### Quality
*What does "done" look like? How will we know?* 
- It is possible to CRUD customers
- It is possible to CRUD vehicles
- It is possible to CRUD reservations per service bay
- It isn't possible to Create/Update reservations if they conflict with an existing reservation
- Reasonable Test coverage
- Instructions to setup and run API locally provided

### Budget
*What is the budget?*
- N/A

## Exclusions
*What is out of the project's scope and should NOT be included?*
- Deployment of API
- Use of production DB (Postgres), SQLite will be used for initial implementation
- Support for multiple dealerships, one database per dealership is assumed
- Authentication/Authorization
- Timezone support. All dates are UTC
- Swagger documentation
