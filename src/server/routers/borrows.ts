import { TRPCError } from "@trpc/server";
import { MongoServerError, ObjectId } from "mongodb";
import { z } from "zod";
import { books, borrows } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";

const BORROW_DAYS = 7;
const objectId = z.string().refine(ObjectId.isValid, "Invalid id");
const doubleBorrow = () =>
  new TRPCError({
    code: "CONFLICT",
    message: "You already borrowed this book",
  });

export const borrowsRouter = router({
  // GET /borrows
  list: protectedProcedure.query(({ ctx }) =>
    borrows
      .find({ userEmail: ctx.user.email })
      .sort({ borrowDate: -1 })
      .toArray(),
  ),

  // POST /borrows
  create: protectedProcedure
    .input(objectId)
    .mutation(async ({ ctx, input: bookId }) => {
      if (await borrows.findOne({ bookId, userEmail: ctx.user.email }))
        throw doubleBorrow();

      // Take one copy only if one is left (atomic).
      const _id = new ObjectId(bookId);
      const book = await books.findOneAndUpdate(
        { _id, copies: { $gt: 0 } },
        { $inc: { copies: -1 } },
      );
      if (!book)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This book is not available",
        });

      const borrowDate = new Date();
      const borrow = {
        bookId,
        bookTitle: book.title,
        bookImage: book.image,
        userEmail: ctx.user.email,
        borrowDate,
        returnDate: new Date(borrowDate.getTime() + BORROW_DAYS * 864e5),
      };
      try {
        const { insertedId } = await borrows.insertOne(borrow);
        return { _id: insertedId, ...borrow };
      } catch (e) {
        // Lost a double-click race: give the copy back.
        await books.updateOne({ _id }, { $inc: { copies: 1 } });
        if (e instanceof MongoServerError && e.code === 11000)
          throw doubleBorrow();
        throw e;
      }
    }),

  // DELETE /borrows/:id — return a book.
  return: protectedProcedure
    .input(objectId)
    .mutation(async ({ ctx, input }) => {
      const borrow = await borrows.findOneAndDelete({
        _id: new ObjectId(input),
        userEmail: ctx.user.email,
      });
      if (!borrow)
        throw new TRPCError({ code: "NOT_FOUND", message: "Borrow not found" });
      await books.updateOne(
        { _id: new ObjectId(borrow.bookId) },
        { $inc: { copies: 1 } },
      );
      return { ok: true };
    }),
});
