import { Prisma } from "@prisma/client";

export function mockUniqueConstraintError() {
	return new Prisma.PrismaClientKnownRequestError(
		"Unique constraint failed on the fields: (`email`)",
		{
			code: "P2002",
			clientVersion: "5.21.1",
			meta: {},
		}
	);
}

export function mockRecordNotFoundError() {
	return new Prisma.PrismaClientKnownRequestError("Record not found", {
		code: "P2025",
		clientVersion: "5.21.1",
		meta: {},
	});
}

export function mockForeignKeyConstraintError() {
	return new Prisma.PrismaClientKnownRequestError(
		"Foreign key constraint failed on the field: (`userId`)",
		{
			code: "P2003",
			clientVersion: "5.21.1",
			meta: {},
		}
	);
}
