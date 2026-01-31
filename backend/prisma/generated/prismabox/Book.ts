import { t } from "elysia";
import { __nullable__ } from "./__nullable__";
import { __transformDate__ } from "./__transformDate__";

export const BookPlain = t.Object(
	{
		id: t.String(),
		title: t.String(),
		authorId: t.String(),
		createdAt: t.Date(),
		updatedAt: t.Date(),
	},
	{ additionalProperties: false },
);

export const BookRelations = t.Object(
	{
		author: t.Object(
			{
				id: t.String(),
				username: t.String(),
				password: t.String(),
				createdAt: t.Date(),
				updatedAt: t.Date(),
			},
			{ additionalProperties: false },
		),
	},
	{ additionalProperties: false },
);

export const BookPlainInputCreate = t.Object(
	{ title: t.String() },
	{ additionalProperties: false },
);

export const BookPlainInputUpdate = t.Object(
	{ title: t.Optional(t.String()) },
	{ additionalProperties: false },
);

export const BookRelationsInputCreate = t.Object(
	{
		author: t.Object(
			{
				connect: t.Object(
					{
						id: t.String({ additionalProperties: false }),
					},
					{ additionalProperties: false },
				),
			},
			{ additionalProperties: false },
		),
	},
	{ additionalProperties: false },
);

export const BookRelationsInputUpdate = t.Partial(
	t.Object(
		{
			author: t.Object(
				{
					connect: t.Object(
						{
							id: t.String({ additionalProperties: false }),
						},
						{ additionalProperties: false },
					),
				},
				{ additionalProperties: false },
			),
		},
		{ additionalProperties: false },
	),
);

export const BookWhere = t.Partial(
	t.Recursive(
		(Self) =>
			t.Object(
				{
					AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
					NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
					OR: t.Array(Self, { additionalProperties: false }),
					id: t.String(),
					title: t.String(),
					authorId: t.String(),
					createdAt: t.Date(),
					updatedAt: t.Date(),
				},
				{ additionalProperties: false },
			),
		{ $id: "Book" },
	),
);

export const BookWhereUnique = t.Recursive(
	(Self) =>
		t.Intersect(
			[
				t.Partial(
					t.Object({ id: t.String() }, { additionalProperties: false }),
					{ additionalProperties: false },
				),
				t.Union([t.Object({ id: t.String() })], {
					additionalProperties: false,
				}),
				t.Partial(
					t.Object({
						AND: t.Union([
							Self,
							t.Array(Self, { additionalProperties: false }),
						]),
						NOT: t.Union([
							Self,
							t.Array(Self, { additionalProperties: false }),
						]),
						OR: t.Array(Self, { additionalProperties: false }),
					}),
					{ additionalProperties: false },
				),
				t.Partial(
					t.Object(
						{
							id: t.String(),
							title: t.String(),
							authorId: t.String(),
							createdAt: t.Date(),
							updatedAt: t.Date(),
						},
						{ additionalProperties: false },
					),
				),
			],
			{ additionalProperties: false },
		),
	{ $id: "Book" },
);

export const BookSelect = t.Partial(
	t.Object(
		{
			id: t.Boolean(),
			title: t.Boolean(),
			authorId: t.Boolean(),
			author: t.Boolean(),
			createdAt: t.Boolean(),
			updatedAt: t.Boolean(),
			_count: t.Boolean(),
		},
		{ additionalProperties: false },
	),
);

export const BookInclude = t.Partial(
	t.Object(
		{ author: t.Boolean(), _count: t.Boolean() },
		{ additionalProperties: false },
	),
);

export const BookOrderBy = t.Partial(
	t.Object(
		{
			id: t.Union([t.Literal("asc"), t.Literal("desc")], {
				additionalProperties: false,
			}),
			title: t.Union([t.Literal("asc"), t.Literal("desc")], {
				additionalProperties: false,
			}),
			authorId: t.Union([t.Literal("asc"), t.Literal("desc")], {
				additionalProperties: false,
			}),
			createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
				additionalProperties: false,
			}),
			updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
				additionalProperties: false,
			}),
		},
		{ additionalProperties: false },
	),
);

export const Book = t.Composite([BookPlain, BookRelations], {
	additionalProperties: false,
});

export const BookInputCreate = t.Composite(
	[BookPlainInputCreate, BookRelationsInputCreate],
	{ additionalProperties: false },
);

export const BookInputUpdate = t.Composite(
	[BookPlainInputUpdate, BookRelationsInputUpdate],
	{ additionalProperties: false },
);
