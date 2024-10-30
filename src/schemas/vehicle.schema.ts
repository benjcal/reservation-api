import vine from "@vinejs/vine";

const vehicleSchema = vine.object({
	id: vine.number().positive().withoutDecimals().optional(),
	customerId: vine.number().positive().withoutDecimals(),
	vin: vine.string().optional(),
	make: vine.string(),
	model: vine.string(),
	year: vine.number().withoutDecimals(),
	mileage: vine.number().withoutDecimals(),
	lastServiceDate: vine.date().optional(),
	nextServiceDue: vine.date().optional(),
	notes: vine.string().optional(),
});

const vehicleParamsByIdSchema = vine.object({
	id: vine.number().positive().withoutDecimals(),
});

export const vehicleParamsByIdValidator = vine.compile(vehicleParamsByIdSchema);

export const vehicleValidator = vine.compile(vehicleSchema);
