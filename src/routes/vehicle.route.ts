import { Router } from "express";

import prisma from "../lib/prisma";

import { handleError } from "./route_helpers";
import {
	vehicleParamsByIdValidator,
	vehicleValidator,
} from "../schemas/vehicle.schema";

const router = Router();

//
// CREATE Vehicle
//
router.post("/", async (req, res) => {
	try {
		const body = await vehicleValidator.validate(req.body);

		const vehicle = await prisma.vehicle.create({ data: body });

		res.status(201);
		res.json(vehicle);
	} catch (error) {
		handleError(error, res);
	}
});

//
// LIST Vehicle
//
router.get("/", async (req, res) => {
	try {
		const vehicles = await prisma.vehicle.findMany();

		res.status(200);
		res.json(vehicles);
	} catch (error) {
		handleError(error, res);
	}
});

//
// GET Vehicle by id
//
router.get("/:id", async (req, res) => {
	try {
		const params = await vehicleParamsByIdValidator.validate(req.params);

		const vehicle = await prisma.vehicle.findFirstOrThrow({
			where: {
				id: params.id,
			},
		});

		res.status(200);
		res.json(vehicle);
	} catch (error) {
		handleError(error, res);
	}
});

//
// UPDATE Vehicle by id
//
router.patch("/:id", async (req, res) => {
	try {
		const params = await vehicleParamsByIdValidator.validate(req.params);

		const body = await vehicleValidator.validate(req.body);

		const vehicle = await prisma.vehicle.update({
			where: {
				id: params.id,
			},
			data: body,
		});

		res.status(200);
		res.json(vehicle);
	} catch (error) {
		handleError(error, res);
	}
});

//
// DELETE Vehicle by id
//
router.delete("/:id", async (req, res) => {
	try {
		const params = await vehicleParamsByIdValidator.validate(req.params);

		await prisma.vehicle.delete({
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
