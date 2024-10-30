import { Router } from "express";

import prisma from "../lib/prisma";
import {
	customerParamsByIdValidator,
	customerValidator,
} from "../schemas/customer.schema";
import { handleError } from "./route_helpers";

const router = Router();

//
// CREATE Customer
//
router.post("/", async (req, res) => {
	try {
		const body = await customerValidator.validate(req.body);

		const customer = await prisma.customer.create({ data: body });

		res.status(201);
		res.json(customer);
	} catch (error) {
		handleError(error, res);
	}
});

//
// LIST Customers
//
router.get("/", async (req, res) => {
	try {
		const customers = await prisma.customer.findMany();

		res.status(200);
		res.json(customers);
	} catch (error) {
		handleError(error, res);
	}
});

//
// GET Customer by id
//
router.get("/:id", async (req, res) => {
	try {
		const params = await customerParamsByIdValidator.validate(req.params);

		const customer = await prisma.customer.findFirstOrThrow({
			where: {
				id: params.id,
			},
			include: {
				reservations: true,
				vehicles: true,
			},
		});

		res.status(200);
		res.json(customer);
	} catch (error) {
		handleError(error, res);
	}
});

//
// UPDATE Customer by id
//
router.patch("/:id", async (req, res) => {
	try {
		const params = await customerParamsByIdValidator.validate(req.params);

		const body = await customerValidator.validate(req.body);

		const customer = await prisma.customer.update({
			where: {
				id: params.id,
			},
			data: body,
		});

		res.status(200);
		res.json(customer);
	} catch (error) {
		handleError(error, res);
	}
});

//
// DELETE Customer by id
//
router.delete("/:id", async (req, res) => {
	try {
		const params = await customerParamsByIdValidator.validate(req.params);

		await prisma.customer.delete({
			where: {
				id: params.id,
			},
		});

		res.status(204);
		res.end();
	} catch (error) {
		handleError(error, res);
	}
});

export default router;
