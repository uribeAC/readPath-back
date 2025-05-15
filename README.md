![MIT License](https://img.shields.io/badge/license-MIT-green)
![Tech Stack](https://img.shields.io/badge/stack-MERN-blue)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-success)
![MongoDB](https://img.shields.io/badge/database-MongoDB-brightgreen)

# 📚 readPath - Backend

**readPath Backend** is the API for managing a personal book collection. It's a CRUD system (Create, Read, Update, Delete) designed for readers who want to track their books without social distractions or clutter.

This project uses **MongoDB, Express, Mongoose, Supertest, Jest**, and **TypeScript** to provide a modern and robust backend experience.

## 🧩 Features

- 📚 Manage books with full CRUD operations
- 🛠️ RESTful API built with **Express**
- 💾 Persistent data storage using **MongoDB** and **Mongoose**
- 🧪 Full test suite with **Jest** and **Supertest**
- 🚀 Clean and efficient codebase using TypeScript

## 🛠️ Technologies Used

This backend is built with:

### Core Stack

- **[Node.js](https://nodejs.org/)** – JavaScript runtime
- **[Express](https://expressjs.com/)** – Web framework for APIs
- **[MongoDB](https://www.mongodb.com/)** – NoSQL database
- **[Mongoose](https://mongoosejs.com/)** – MongoDB ODM
- **[TypeScript](https://www.typescriptlang.org/)** – Static type checking

### Testing

- **[Jest](https://jestjs.io/)** – Unit and integration testing framework
- **[Supertest](https://github.com/visionmedia/supertest)** – HTTP assertions for testing Express APIs

## 🚀 How to Use

To run the backend locally, make sure you have **MongoDB** running on your machine, then:

```bash
# 1. Clone the repository
git clone https://github.com/uribeAC/readPath-back.git
cd readPath-back

# 2. Install dependencies
npm install

# 3. Start the server
npm run start
```

The backend server runs on [https://alex-uribe-202502-back.onrender.com/](https://alex-uribe-202502-back.onrender.com/).

### Available Scripts

- `npm run start` – Start the server in production mode
- `npm run start:dev` – Start the server in development mode with live reload
- `npm run build` – Build the project for production
- `npm run build:dev` – Build the project for development
- `npm run test` – Run all tests once
- `npm run test:dev` – Run tests in watch mode
- `npm run test:coverage` – Generate a test coverage report

## 📦 API Endpoints

The Express backend exposes the following RESTful endpoints to manage your book collection:

### 📘 Books

#### ➕ Create a book

`POST /books/`

Creates a new book in the collection.

- **Example Body** (JSON):

```json
{
  "book": {
    "title": "Dragon Ball, Vol. 1",
    "author": "Akira Toriyama",
    "saga": {
      "name": "Dragon Ball",
      "bookNumber": 1
    },
    "description": "Follow the adventures of a young monkey-tailed boy named Goku...",
    "genres": ["Manga", "Action", "Adventure", "Comedy"],
    "pages": 192,
    "firstPublished": "2003-05-06",
    "state": "read",
    "yourRating": 5,
    "readDates": {
      "dateStarted": "2021-03-15",
      "dateFinished": "2021-03-17",
      "readYear": 2021
    },
    "coverImageUrlSmall": "https://...",
    "coverImageUrlBig": "https://...",
    "imageAlt": "Dragon Ball Volume 1 cover featuring young Goku riding a cloud"
  }
}
```

---

#### 📚 Get all books

`GET /books/`

Retrieves the full list of books in the database.

---

#### ✅ Mark a book as **read**

`PATCH /books/mark-as-read/:bookId`

Updates the book with the given `bookId` and sets its state to `"read"`.

- Example:  
  `PATCH /books/mark-as-read/681b126152db6fc282a4b7f0`

---

#### 📌 Mark a book as **to read**

`PATCH /books/mark-as-toread/:bookId`

Updates the book with the given `bookId` and sets its state to `"to read"`.

- Example:  
  `PATCH /books/mark-as-toread/681b126152db6fc282a4b7f0`

---

### 🧠 Notes

- All requests should include the header:
  ```
  Content-Type: application/json
  ```
- `bookId` is a MongoDB ObjectId and must be valid to avoid errors.
- The `state` field accepts two values: `"read"` or `"to read"`.

### Database

All data is stored in a **MongoDB** database using **Mongoose** models.

## 💡 Need Help?

If you encounter any issues or have suggestions, feel free to open an issue or discussion on the GitHub repository:

🔗 [https://github.com/uribeAC/readPath-back](https://github.com/uribeAC/readPath-back)

## 👨‍💻 Author

- [Alex Uribe](https://github.com/uribeAC) — Project creator & maintainer

## 📄 License

This project is licensed under the **MIT License**.

---

Made with ❤️ using the MERN stack: MongoDB, Express, React, and Node.js
