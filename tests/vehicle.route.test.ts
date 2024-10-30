import supertest from "supertest";
import { describe, expect, test, vi } from "vitest";

import { Vehicle } from "@prisma/client";

import app from "../src/app";
import prisma from "../src/lib/__mocks__/prisma";
import {
	mockForeignKeyConstraintError,
	mockRecordNotFoundError,
} from "./test_helpers";

vi.mock("../src/lib/prisma");

const mockVehicle: Vehicle = {
	id: 1,
	customerId: 1,
	vin: null,
	make: "make",
	model: "model",
	year: 2020,
	mileage: 1,
	lastServiceDate: null,
	nextServiceDue: null,
	notes: null,
};

//
// CREATE Vehicle
//
describe("can create vehicle", () => {
	test("with invalid data", async () => {
		const response = await supertest(app)
			.post("/vehicle")
			.send({ invalid: "data" });

		expect(response.status).toBe(400);
	});

	test("with valid data", async () => {
		prisma.vehicle.create.mockResolvedValue(mockVehicle);

		const response = await supertest(app)
			.post("/vehicle")
			.send(mockVehicle);

		expect(response.status).toBe(201);
		expect(response.body).toStrictEqual(mockVehicle);
	});

	test("with not existing customer", async () => {
		prisma.vehicle.create.mockImplementation(() => {
			throw mockForeignKeyConstraintError();
		});

		const response = await supertest(app)
			.post("/vehicle")
			.send(mockVehicle);

		expect(response.status).toBe(409);
	});
});

//
// LIST Vehicles
//
describe("can list vehicles", () => {
	test("without data", async () => {
		prisma.vehicle.findMany.mockResolvedValue([]);
		const response = await supertest(app).get("/vehicle");

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual([]);
	});

	test("with data", async () => {
		prisma.vehicle.findMany.mockResolvedValue([mockVehicle]);
		const response = await supertest(app).get("/vehicle");

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual([mockVehicle]);
	});
});

//
// GET Vehicle by id
//
describe("can get vehicle by id", () => {
	test("with invalid id", async () => {
		const response = await supertest(app).get("/vehicle/invalid");

		expect(response.status).toBe(400);
	});

	test("vehicle not found", async () => {
		prisma.vehicle.findFirstOrThrow.mockImplementation(() => {
			throw mockRecordNotFoundError();
		});
		const response = await supertest(app).get("/vehicle/1");

		expect(response.status).toBe(404);
	});

	test("vehicle found", async () => {
		prisma.vehicle.findFirstOrThrow.mockResolvedValue(mockVehicle);
		const response = await supertest(app).get("/vehicle/1");

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual(mockVehicle);
	});
});

//
// UPDATE Vehicle by id
//
describe("can update vehicle", () => {
	test("with invalid data", async () => {
		const response = await supertest(app)
			.patch("/vehicle/1")
			.send({ invalid: "data" });

		expect(response.status).toBe(400);
	});

	test("with valid data", async () => {
		prisma.vehicle.update.mockResolvedValue(mockVehicle);

		const response = await supertest(app)
			.patch("/vehicle/1")
			.send(mockVehicle);

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual(mockVehicle);
	});

	test("with not found", async () => {
		prisma.vehicle.update.mockImplementation(() => {
			throw mockRecordNotFoundError();
		});

		const response = await supertest(app)
			.patch("/vehicle/1")
			.send(mockVehicle);

		expect(response.status).toBe(404);
	});
});

//
// DELETE Vehicle by id
//
describe("can delete vehicle by id", () => {
	test("with invalid id", async () => {
		const response = await supertest(app).delete("/vehicle/invalid");

		expect(response.status).toBe(400);
	});

	test("vehicle not found", async () => {
		prisma.vehicle.delete.mockImplementation(() => {
			throw mockRecordNotFoundError();
		});

		const response = await supertest(app).delete("/vehicle/1");

		expect(response.status).toBe(404);
	});

	test("vehicle found", async () => {
		prisma.vehicle.delete.mockResolvedValue(mockVehicle);

		const response = await supertest(app).delete("/vehicle/1");

		expect(response.status).toBe(204);
	});
});
