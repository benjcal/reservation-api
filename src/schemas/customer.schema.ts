import vine from "@vinejs/vine";

const customerSchema = vine.object({
	id: vine.number().positive().withoutDecimals().optional(),
	firstName: vine.string(),
	lastName: vine.string(),
	email: vine.string().email(),
	phoneNumber: vine.string().optional(),
	street: vine.string().optional(),
	city: vine.string().optional(),
	state: vine.string().optional(),
	postalCode: vine.string().optional(),
	country: vine.string().optional(),
	notes: vine.string().optional(),
});

const customerParamsByIdSchema = vine.object({
	id: vine.number().positive().withoutDecimals(),
});

export const customerValidator = vine.compile(customerSchema);

export const customerParamsByIdValidator = vine.compile(
	customerParamsByIdSchema
);
