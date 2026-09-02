# Inforce Frontend Task — Product List App

A small shop simulation built with React, Redux Toolkit, and TypeScript. Users can browse, add, edit, delete, and sort products, as well as manage comments on product detail pages. The app uses an API for data persistence.
`json-server`.

## Demo

[https://andriy-stetsula.github.io/inforce-frontend-task/](https://andriy-stetsula.github.io/inforce-frontend-task/)

## Tech stack

- React 19 + Vite
- Redux Toolkit (`createAsyncThunk` + slices)
- TypeScript
- React Router
- json-server (mock REST API)

## Getting started

Install dependencies:

```bash
npm install
```

Run the mock API server (serves `db.json` on port 3001):

```bash
npm run server
```

In a separate terminal, run the app:

```bash
npm run dev
```

The app expects the API at `http://localhost:3001`. Open the printed Vite
URL (usually `http://localhost:5173`) in your browser.

## Available scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run server`  | Start json-server on port 3001       |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run oxlint                           |

## Features

- **Product list view**
  - Add a product via a modal form (validated — cannot submit empty fields)
  - Delete a product with a confirmation modal
  - Sort alphabetically by default, then by count; sort order selectable
    from a dropdown
- **Product detail view**
  - View all product details
  - Edit product details via a modal form
  - Add and delete comments for the product

## Data models

```ts
interface Product {
  id: string;
  imageUrl: string;
  name: string;
  count: number;
  size: { width: number; height: number };
  weight: string;
  comments: string[];
}

interface Comment {
  id: string;
  productId: string;
  description: string;
  date: string;
}
```

## Known limitations

- No optimistic UI / error toasts for create, update, or delete requests —
  only the initial fetch surfaces a loading/error state.
- Demo deployment (GitHub Pages) shows only the static frontend — since
  `json-server` runs locally, live create/update/delete against a real API
  requires running the
