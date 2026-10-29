import { TRPCError } from "@trpc/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { books } from "@/lib/db";
import { CATEGORIES } from "@/lib/utils";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const objectId = z
  .string()
  .refine(ObjectId.isValid, "Invalid id")
  .transform((id) => new ObjectId(id));

const bookInput = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().min(1),
  category: z.enum(CATEGORIES),
  image: z.url(),
  description: z.string().trim().min(1),
  copies: z.number().int().min(0),
});

const notFound = () =>
  new TRPCError({ code: "NOT_FOUND", message: "Book not found" });

export const booksRouter = router({
  // GET /books (public). `limit` powers New Arrivals.
  list: publicProcedure
    .input(z.object({ limit: z.number().int().min(0).default(0) }).optional())
    .query(({ input }) =>
      books
        // Public list: hide the uploader's email.
        .find({}, { projection: { "addedBy.email": 0 } })
        .sort({ createdAt: -1 })
        .limit(input?.limit ?? 0)
        .toArray(),
    ),

  // Books added by the logged in user (My Books).
  mine: protectedProcedure.query(({ ctx }) =>
    books
      .find({ "addedBy.email": ctx.user.email })
      .sort({ createdAt: -1 })
      .toArray(),
  ),

  // GET /books/:id
  byId: protectedProcedure.input(objectId).query(async ({ input }) => {
    const book = await books.findOne({ _id: input });
    if (!book) throw notFound();
    return book;
  }),

  // POST /books
  create: protectedProcedure
    .input(bookInput)
    .mutation(async ({ ctx, input }) => {
      const book = {
        ...input,
        addedBy: { name: ctx.user.name, email: ctx.user.email },
        createdAt: new Date(),
      };
      const { insertedId } = await books.insertOne(book);
      return { _id: insertedId, ...book };
    }),

  // PATCH /books/:id (owner only)
  update: protectedProcedure
    .input(bookInput.partial().extend({ id: objectId }))
    .mutation(async ({ ctx, input: { id, ...$set } }) => {
      const book = await books.findOneAndUpdate(
        { _id: id, "addedBy.email": ctx.user.email },
        { $set },
        { returnDocument: "after" },
      );
      if (!book) throw notFound();
      return book;
    }),

  // DELETE /books/:id (owner only)
  delete: protectedProcedure
    .input(objectId)
    .mutation(async ({ ctx, input }) => {
      const { deletedCount } = await books.deleteOne({
        _id: input,
        "addedBy.email": ctx.user.email,
      });
      if (!deletedCount) throw notFound();
      return { ok: true };
    }),
});
