import {
	areIntervalsOverlapping,
	endOfDay,
	interval,
	startOfDay,
} from "date-fns";
import { Router } from "express";
import prisma from "../lib/prisma";
import {
	reservationByServiceBayReqValidator,
	reservationParamsByIdValidator,
	reservationValidator,
} from "../schemas/reservation.schema";
import { handleError } from "./route_helpers";

const router = Router();

//
// CREATE reservation
//
router.post("/", async (req, res) => {
	try {
		const body = await reservationValidator.validate(req.body);

		// Find existing reservation from the start of the day of the new reservation
		// to the end of the day of the new reservation
		const existingReservations = await prisma.reservation.findMany({
			where: {
				serviceBayId: body.serviceBayId,
				startTime: {
					gte: startOfDay(body.startTime),
				},
				endTime: {
					lte: endOfDay(body.endTime),
				},
			},
		});

		// Check if the new reservation overlaps with any existing reservation
		const overlappingReservations = existingReservations.filter((r) => {
			return areIntervalsOverlapping(
				interval(body.startTime, body.endTime),
				interval(r.startTime, r.endTime)
			);
		});

		const isTimeSlotAvailable = overlappingReservations.length === 0;

		if (isTimeSlotAvailable) {
			const reservation = await prisma.reservation.create({ data: body });
			res.status(201);
			res.json(reservation);
		} else {
			res.status(409);
			res.json({
				error: "Conflict with existing reservations",
				reservations: existingReservations,
			});
		}
	} catch (error) {
		handleError(error, res);
	}
});

//
// LIST reservations
//
router.get("/", async (req, res) => {
	try {
		const reservations = await prisma.reservation.findMany();

		res.status(200);
		res.json(reservations);
	} catch (error) {
		handleError(error, res);
	}
});

//
// LIST reservations by Service Bay
//
router.get("/by-service-bay/:id", async (req, res) => {
	try {
		const params = await reservationByServiceBayReqValidator.validate(
			req.params
		);

		const reservations = await prisma.reservation.findMany({
			where: {
				serviceBayId: params.id,
			},
		});

		res.status(200);
		res.json(reservations);
	} catch (error) {
		handleError(error, res);
	}
});

//
// GET reservations by id
//
router.get("/:id", async (req, res) => {
	try {
		const params = await reservationParamsByIdValidator.validate(
			req.params
		);

		const reservations = await prisma.reservation.findFirstOrThrow({
			where: {
				serviceBayId: params.id,
			},
		});

		res.status(200);
		res.json(reservations);
	} catch (error) {
		handleError(error, res);
	}
});

//
// UPDATE reservation
//
router.patch("/:id", async (req, res) => {
	try {
		const body = await reservationValidator.validate(req.body);

		// Find existing reservation from the start of the day of the new reservation
		// to the end of the day of the new reservation excluding itself
		const existingReservations = await prisma.reservation.findMany({
			where: {
				id: {
					not: body.id,
				},
				serviceBayId: body.serviceBayId,
				startTime: {
					gte: startOfDay(body.startTime),
				},
				endTime: {
					lte: endOfDay(body.endTime),
				},
			},
		});

		// Check if the new reservation overlaps with any existing reservation
		const overlappingReservations = existingReservations.filter((r) => {
			return areIntervalsOverlapping(
				interval(body.startTime, body.endTime),
				interval(r.startTime, r.endTime)
			);
		});

		const isTimeSlotAvailable = overlappingReservations.length === 0;

		if (isTimeSlotAvailable) {
			const reservation = await prisma.reservation.update({
				where: { id: body.id },
				data: body,
			});
			res.status(201);
			res.json(reservation);
		} else {
			res.status(409);
			res.json({
				error: "Conflict with existing reservations",
				reservations: existingReservations,
			});
		}
	} catch (error) {
		handleError(error, res);
	}
});

//
// DELETE reservation
//
router.delete("/:id", async (req, res) => {
	try {
		const params = await reservationParamsByIdValidator.validate(
			req.params
		);

		await prisma.reservation.delete({
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
