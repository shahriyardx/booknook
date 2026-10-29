# BookNook

A small online library. Add a book, borrow a book, return a book.

**Live site:** _add your Vercel URL here_

## Features

- Browse every book on the shelf. New Arrivals on the home page show the 6 newest books.
- Log in with email and password or with Google (BetterAuth + MongoDB adapter).
- Add books with a cover image uploaded to imgbb. Edit or delete your own books from My Books.
- Borrow a book for 7 days. Copies go down by 1 on borrow and up by 1 on return (`$inc`).
- You cannot borrow the same book twice at the same time. Books with 0 copies show "Not Available".
- Every API call is protected with a BetterAuth JWT (verified on the server through JWKS).
- Dark and light theme, responsive layout, custom 404 page.

## Tech

Next.js (App Router) · TypeScript · shadcn/ui · Tailwind CSS · tRPC · TanStack Query · BetterAuth · MongoDB · Swiper · Sonner

## API (tRPC, `/api/trpc`)

| Procedure        | Same as               | Auth    |
| ---------------- | --------------------- | ------- |
| `books.list`     | `GET /books`          | public  |
| `books.byId`     | `GET /books/:id`      | JWT     |
| `books.create`   | `POST /books`         | JWT     |
| `books.update`   | `PATCH /books/:id`    | owner   |
| `books.delete`   | `DELETE /books/:id`   | owner   |
| `books.mine`     | books I added         | JWT     |
| `borrows.create` | `POST /borrows`       | JWT     |
| `borrows.list`   | `GET /borrows`        | JWT     |
| `borrows.return` | `DELETE /borrows/:id` | JWT     |

## Run locally

```bash
cp .env.example .env.local   # fill in the values
bun install
bun dev
```
