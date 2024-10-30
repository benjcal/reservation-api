import supertest from "supertest";
import { describe, expect, test, vi } from "vitest";

import { Customer } from "@prisma/client";

import app from "../src/app";
import prisma from "../src/lib/__mocks__/prisma";
import { mockRecordNotFoundError } from "./test_helpers";

vi.mock("../src/lib/prisma");

const mockCustomer: Customer = {
	id: 1,
	firstName: "John",
	lastName: "Doe",
	email: "johnd@example.com",
	phoneNumber: null,
	street: null,
	city: null,
	state: null,
	postalCode: null,
	country: null,
	notes: null,
};

//
// CREATE Customer
//
describe("can create customer", () => {
	test("with invalid data", async () => {
		const response = await supertest(app)
			.post("/customer")
			.send({ invalid: "data" });

		expect(response.status).toBe(400);
	});

	test("with valid data", async () => {
		prisma.customer.create.mockResolvedValue(mockCustomer);

		const response = await supertest(app)
			.post("/customer")
			.send(mockCustomer);

		expect(response.status).toBe(201);
		expect(response.body).toStrictEqual(mockCustomer);
	});
});

//
// LIST Customers
//
describe("can list customers", () => {
	test("without customers", async () => {
		prisma.customer.findMany.mockResolvedValue([]);
		const response = await supertest(app).get("/customer");

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual([]);
	});

	test("with customers", async () => {
		prisma.customer.findMany.mockResolvedValue([mockCustomer]);
		const response = await supertest(app).get("/customer");

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual([mockCustomer]);
	});
});

//
// GET Customer by id
//
describe("can get customer by id", () => {
	test("with invalid id", async () => {
		const response = await supertest(app).get("/customer/invalid");

		expect(response.status).toBe(400);
	});

	test("customer not found", async () => {
		prisma.customer.findFirstOrThrow.mockImplementation(() => {
			throw mockRecordNotFoundError();
		});
		const response = await supertest(app).get("/customer/1");

		expect(response.status).toBe(404);
	});

	test("customer found", async () => {
		prisma.customer.findFirstOrThrow.mockResolvedValue(mockCustomer);
		const response = await supertest(app).get("/customer/1");

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual(mockCustomer);
	});
});

//
// UPDATE Customer by id
//
describe("can update customer", () => {
	test("with invalid data", async () => {
		const response = await supertest(app)
			.patch("/customer/1")
			.send({ invalid: "data" });

		expect(response.status).toBe(400);
	});

	test("with customer not found", async () => {
		prisma.customer.update.mockImplementation(() => {
			throw mockRecordNotFoundError();
		});

		const response = await supertest(app)
			.patch("/customer/1")
			.send(mockCustomer);

		expect(response.status).toBe(404);
	});

	test("with valid data", async () => {
		prisma.customer.update.mockResolvedValue(mockCustomer);

		const response = await supertest(app)
			.patch("/customer/1")
			.send(mockCustomer);

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual(mockCustomer);
	});
});

//
// DELETE Customer by id
//
describe("can delete customer by id", () => {
	test("with invalid id", async () => {
		const response = await supertest(app).delete("/customer/invalid");

		expect(response.status).toBe(400);
	});

	test("customer not found", async () => {
		prisma.customer.delete.mockImplementation(() => {
			throw mockRecordNotFoundError();
		});

		const response = await supertest(app).delete("/customer/1");

		expect(response.status).toBe(404);
	});

	test("customer found", async () => {
		prisma.customer.delete.mockResolvedValue(mockCustomer);

		const response = await supertest(app).delete("/customer/1");

		expect(response.status).toBe(204);
	});
});
