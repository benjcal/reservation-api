import supertest from "supertest";
import { describe, expect, test, vi } from "vitest";

import { Reservation } from "@prisma/client";

import app from "../src/app";
import prisma from "../src/lib/__mocks__/prisma";
import {
	mockForeignKeyConstraintError,
	mockRecordNotFoundError,
} from "./test_helpers";

vi.mock("../src/lib/prisma");

const reservationReqConflictBefore = {
	customerId: 1,
	vehicleId: 1,
	serviceBayId: 1,
	startTime: "2024-06-14 07:45:00",
	endTime: "2024-06-14 08:01:00",
};

const reservationReqConflictAfter = {
	customerId: 1,
	vehicleId: 1,
	serviceBayId: 1,
	startTime: "2024-06-14 10:30:00",
	endTime: "2024-06-14 11:00:00",
};

const reservationReqConflictInside = {
	customerId: 1,
	vehicleId: 1,
	serviceBayId: 1,
	startTime: "2024-06-14 09:10:00",
	endTime: "2024-06-14 09:50:00",
};

const reservationReqConflictBigger = {
	customerId: 1,
	vehicleId: 1,
	serviceBayId: 1,
	startTime: "2024-06-14 07:50:00",
	endTime: "2024-06-14 08:40:00",
};

const reservationReqEndBeforeStart = {
	customerId: 1,
	vehicleId: 1,
	serviceBayId: 1,
	startTime: "2024-06-14 09:00:00",
	endTime: "2024-06-14 08:00:00",
};

const reservationReqOk = {
	customerId: 1,
	vehicleId: 1,
	serviceBayId: 1,
	startTime: "2024-06-14 14:00:00",
	endTime: "2024-06-14 15:00:00",
};

const mockReservations: Reservation[] = [
	{
		id: 1,
		customerId: 1,
		vehicleId: 1,
		serviceBayId: 1,
		startTime: new Date("2024-06-14 08:00:00"),
		endTime: new Date("2024-06-14 08:30:00"),
	},
	{
		id: 2,
		customerId: 1,
		vehicleId: 1,
		serviceBayId: 1,
		startTime: new Date("2024-06-14 09:00:00"),
		endTime: new Date("2024-06-14 10:00:00"),
	},
	{
		id: 3,
		customerId: 1,
		vehicleId: 1,
		serviceBayId: 1,
		startTime: new Date("2024-06-14 10:15:00"),
		endTime: new Date("2024-06-14 11:00:00"),
	},
];

//
// CREATE Reservation
//
describe("can create reservation", () => {
	test("with invalid data", async () => {
		const response = await supertest(app)
			.post("/reservation")
			.send({ invalid: "data" });

		expect(response.status).toBe(400);
	});

	test("with valid data", async () => {
		prisma.reservation.findMany.mockResolvedValue([]);
		prisma.reservation.create.mockResolvedValue(mockReservations[0]);

		const response = await supertest(app)
			.post("/reservation")
			.send(reservationReqOk);

		expect(response.status).toBe(201);
	});

	test("with conflict before", async () => {
		prisma.reservation.findMany.mockResolvedValue(mockReservations);

		const response = await supertest(app)
			.post("/reservation")
			.send(reservationReqConflictBefore);

		expect(prisma.reservation.create).toHaveBeenCalledTimes(0);
		expect(response.status).toBe(409);
	});

	test("with conflict after", async () => {
		prisma.reservation.findMany.mockResolvedValue(mockReservations);

		const response = await supertest(app)
			.post("/reservation")
			.send(reservationReqConflictAfter);

		expect(prisma.reservation.create).toHaveBeenCalledTimes(0);
		expect(response.status).toBe(409);
	});

	test("with conflict inside", async () => {
		prisma.reservation.findMany.mockResolvedValue(mockReservations);

		const response = await supertest(app)
			.post("/reservation")
			.send(reservationReqConflictInside);

		expect(prisma.reservation.create).toHaveBeenCalledTimes(0);
		expect(response.status).toBe(409);
	});

	test("with conflict bigger", async () => {
		prisma.reservation.findMany.mockResolvedValue(mockReservations);

		const response = await supertest(app)
			.post("/reservation")
			.send(reservationReqConflictBigger);

		expect(prisma.reservation.create).toHaveBeenCalledTimes(0);
		expect(response.status).toBe(409);
	});

	test("with end before start", async () => {
		prisma.reservation.findMany.mockResolvedValue(mockReservations);

		const response = await supertest(app)
			.post("/reservation")
			.send(reservationReqEndBeforeStart);

		expect(prisma.reservation.create).toHaveBeenCalledTimes(0);
		expect(response.status).toBe(400);
	});

	test("returns correct conflicting reservation", async () => {
		prisma.reservation.findMany.mockResolvedValue(mockReservations);

		const response = await supertest(app)
			.post("/reservation")
			.send(reservationReqConflictBefore);

		expect(prisma.reservation.create).toHaveBeenCalledTimes(0);
		expect(response.status).toBe(409);
		expect(response.body.error).toBe("Conflict with existing reservations");
		expect(response.body.reservations[0].id).toBe(1);
		expect(response.body.reservations[0].startTime).toBe(
			new Date("2024-06-14 08:00:00").toISOString()
		);
		expect(response.body.reservations[0].endTime).toBe(
			new Date("2024-06-14 08:30:00").toISOString()
		);
	});

	test("with non existing customer/vehicle/service bay", async () => {
		prisma.reservation.create.mockImplementation(() => {
			throw mockForeignKeyConstraintError();
		});
		prisma.reservation.findMany.mockResolvedValue(mockReservations);

		const response = await supertest(app)
			.post("/reservation")
			.send(reservationReqOk);

		expect(response.status).toBe(409);
	});
});

//
// LIST Reservations
//
describe("can list reservations", () => {
	test("with data", async () => {
		prisma.reservation.findMany.mockResolvedValue(mockReservations);
		const response = await supertest(app).get("/reservation");

		expect(response.status).toBe(200);
		expect(response.body.length).toBe(3);
	});

	test("with no data", async () => {
		prisma.reservation.findMany.mockResolvedValue([]);
		const response = await supertest(app).get("/reservation");

		expect(response.status).toBe(200);
		expect(response.body.length).toBe(0);
	});

	test("by service bay", async () => {
		prisma.reservation.findMany.mockResolvedValue(mockReservations);
		const response = await supertest(app).get(
			"/reservation/by-service-bay/1"
		);

		expect(response.status).toBe(200);
		expect(response.body.length).toBe(3);
	});
});

//
// GET Reservation by id
//
describe("can get reservation", () => {
	test("with invalid id", async () => {
		const response = await supertest(app).get("/reservation/invalid");

		expect(response.status).toBe(400);
	});

	test("with not found", async () => {
		prisma.reservation.findFirstOrThrow.mockImplementation(() => {
			throw mockRecordNotFoundError();
		});

		const response = await supertest(app).get("/reservation/1");

		expect(response.status).toBe(404);
	});

	test("with found", async () => {
		prisma.reservation.findFirstOrThrow.mockResolvedValue(
			mockReservations[0]
		);

		const response = await supertest(app).get("/reservation/1");

		expect(response.status).toBe(200);
		expect(response.body.id).toBe(1);
	});
});

//
// UPDATE Reservation by id
//
describe("can update reservation", () => {
	test("with invalid data", async () => {
		const response = await supertest(app)
			.patch("/reservation/1")
			.send({ invalid: "data" });

		expect(response.status).toBe(400);
	});

	test("with not conflict", async () => {
		prisma.reservation.findMany.mockResolvedValue([]);
		prisma.reservation.update.mockResolvedValue(mockReservations[0]);

		const response = await supertest(app)
			.patch("/reservation/1")
			.send(reservationReqOk);

		expect(response.status).toBe(201);
	});

	test("with conflict", async () => {
		prisma.reservation.findMany.mockResolvedValue(mockReservations);
		prisma.reservation.update;

		const response = await supertest(app)
			.patch("/reservation/1")
			.send(reservationReqConflictAfter);

		expect(prisma.reservation.update).toBeCalledTimes(0);
		expect(response.status).toBe(409);
	});
});

//
// DELETE Reservation by id
//
describe("can delete reservation", () => {
	test("with invalid id", async () => {
		const response = await supertest(app).delete("/reservation/invalid");

		expect(response.status).toBe(400);
	});

	test("with valid id", async () => {
		prisma.reservation.delete.mockResolvedValue(mockReservations[0]);
		const response = await supertest(app).delete("/reservation/1");

		expect(response.status).toBe(204);
	});

	test("with not found", async () => {
		prisma.reservation.delete.mockImplementation(() => {
			throw mockRecordNotFoundError();
		});

		const response = await supertest(app).delete("/reservation/1");

		expect(response.status).toBe(404);
	});
});
