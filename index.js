const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const usersFilePath = path.join(__dirname, "data", "users.json");
const booksFilePath = path.join(__dirname, "data", "books.json");

// Load existing users and books from JSON files
let users = [];
let books = [];

try {
  const usersData = fs.readFileSync(usersFilePath);
  users = JSON.parse(usersData);
} catch (error) {
  console.log("No existing users data found.");
}

try {
  const booksData = fs.readFileSync(booksFilePath);
  books = JSON.parse(booksData);
} catch (error) {
  console.log("No existing books data found.");
}

// Helper function to save users data to JSON file
function saveUsersData() {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Helper function to save books data to JSON file
function saveBooksData() {
  fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
}

// Helper function to parse request body
function parseRequestBody(req, callback) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    callback(JSON.parse(body));
  });
}

// Helper function to send JSON response
function sendJSONResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const pathname = reqUrl.pathname;

  if (req.method === "POST") {
    if (pathname === "/users") {
      parseRequestBody(req, (newUser) => {
        users.push(newUser);
        saveUsersData();
        sendJSONResponse(res, 201, {
          message: "User created successfully",
          user: newUser,
        });
      });
    } else if (pathname === "/users/authenticate") {
      // Authentication logic here
      sendJSONResponse(res, 501, {
        message: "Authentication logic not implemented yet",
      });
    } else if (pathname === "/books") {
      parseRequestBody(req, (newBook) => {
        books.push(newBook);
        saveBooksData();
        sendJSONResponse(res, 201, {
          message: "Book created successfully",
          book: newBook,
        });
      });
    } else if (pathname === "/books/loan") {
      // Loan out logic here
      sendJSONResponse(res, 501, {
        message: "Loan out logic not implemented yet",
      });
    } else if (pathname === "/books/return") {
      // Return logic here
      sendJSONResponse(res, 501, {
        message: "Return logic not implemented yet",
      });
    }
  } else if (req.method === "GET") {
    if (pathname === "/users") {
      sendJSONResponse(res, 200, users);
    } else if (pathname === "/books" || pathname === "/") {
      sendJSONResponse(res, 200, books);
    }
  } else if (req.method === "DELETE") {
    if (pathname.startsWith("/books")) {
      const bookId = pathname.split("/")[3];
      // Delete book logic here
      sendJSONResponse(res, 501, {
        message: "Delete book logic not implemented yet",
      });
    }
  } else if (req.method === "PUT") {
    if (pathname === "/books") {
      // Update book logic here
      sendJSONResponse(res, 501, {
        message: "Update book logic not implemented yet",
      });
    }
  } else {
    sendJSONResponse(res, 404, { message: "Route not found" });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
