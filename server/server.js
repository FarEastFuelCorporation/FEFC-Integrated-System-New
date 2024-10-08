// server.js
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("./app");
const port = process.env.PORT || 24156;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
