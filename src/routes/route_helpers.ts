import { Prisma } from "@prisma/client";
import { errors } from "@vinejs/vine";
import { Response } from "express";
import { prismaError } from "prisma-better-errors";

export const handleError = (error: unknown, res: Response) => {
	if (error instanceof errors.E_VALIDATION_ERROR) {
		res.status(400);
		res.json(error.messages);
		return;
	}

	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		const pError = new prismaError(error);
		res.status(pError.statusCode);
		res.json(pError);
		return;
	}

	res.status(500);
	res.json(error);
};
