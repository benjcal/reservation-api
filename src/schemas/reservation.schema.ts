import vine from "@vinejs/vine";

const reservationSchema = vine.object({
	id: vine.number().positive().withoutDecimals().optional(),
	serviceBayId: vine.number().withoutDecimals(),
	customerId: vine.number().positive().withoutDecimals(),
	vehicleId: vine.number().positive().withoutDecimals(),
	startTime: vine.date(),
	endTime: vine.date().afterField("startTime", { compare: "minutes" }),
});

const reservationByServiceBayReqSchema = vine.object({
	id: vine.number().positive().withoutDecimals(),
});

const reservationParamsByIdSchema = vine.object({
	id: vine.number().positive().withoutDecimals(),
});

export const reservationValidator = vine.compile(reservationSchema);

export const reservationByServiceBayReqValidator = vine.compile(
	reservationByServiceBayReqSchema
);

export const reservationParamsByIdValidator = vine.compile(
	reservationParamsByIdSchema
);
