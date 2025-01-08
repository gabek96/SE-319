const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const app = express();

// Constants
const PORT = 8081;
const HOST = "localhost";
const DB_NAME = "secoms319"; // Define your database name here


// Middleware
app.use(cors());
app.use(express.json()); // Built-in middleware for JSON
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Serve images statically

// Create "uploads" folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filenames
  },
});
const upload = multer({ storage: storage });

// MongoDB connection URI and client setup
const uri = "mongodb://localhost:27017"; // Update as needed
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Define collections after connection
let db, comicsCollection, commentsCollection, usersCollection, postsCollection, countersCollection;

// Connect to MongoDB and start the server
client.connect()
  .then(() => {
    db = client.db(DB_NAME);
    comicsCollection = db.collection("comics");
    usersCollection = db.collection("users");
    commentsCollection = db.collection("Comments");

    console.log("Connected to MongoDB");

    // Start the server after successful connection
    app.listen(PORT, () => {
      console.log(`App listening at http://${HOST}:${PORT}`);
      console.log('Top-Shelf is Live');
    });
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the application if DB connection fails
  });

// Helper function to get next sequence value for comic IDs
async function getNextComicId() {
  const result = await countersCollection.findOneAndUpdate(
    { _id: "comicId" },
    { $inc: { sequence_value: 1 } },
    { returnOriginal: false, upsert: true }
  );
  return result.value.sequence_value;
}

// --------------------- Comics Routes ---------------------

// Fetch all comics
app.get("/comics", async (req, res) => {
  try {
    const comics = await comicsCollection.find().toArray();
    res.status(200).json(comics);
  } catch (err) {
    console.error("Error reading all comics:", err);
    res.status(500).send({ error: "Error reading comics" });
  }
});

// Fetch comics by title
app.get("/comics/title", async (req, res) => {
  const { title } = req.query;

  try {
    if (!title) {
      return res.status(400).send({ error: "Title is required" });
    }

    const searchValue = new RegExp(title, "i"); // Case-insensitive search
    const comics = await comicsCollection.find({ title: searchValue }).toArray();

    if (comics.length === 0) {
      return res.status(404).send({ message: "No comics found with the given title" });
    }

    res.status(200).json(comics);
  } catch (err) {
    console.error("Error fetching comics by title:", err);
    res.status(500).send({ error: "An unexpected error occurred: " + err.message });
  }
});

// Fetch a single comic by numeric id
app.get("/comics/:id", async (req, res) => {
  try {
    const comicIdParam = req.params.id;
    const comicId = parseInt(comicIdParam, 10); // Convert id to number

    // Validate that comicId is a valid number
    if (isNaN(comicId)) {
      return res.status(400).json({ error: "Invalid comic ID. It must be a number." });
    }

    // Query the comics collection using the numeric id
    const comic = await comicsCollection.findOne(
      { id: comicId }, // Assuming 'id' is the numeric field
      { projection: { title: 1, author: 1, genres: 1, description: 1, image_url: 1, ratings: 1 } }
    );

    if (!comic) {
      return res.status(404).json({ error: "Comic not found" });
    }

    res.status(200).json(comic);
  } catch (error) {
    console.error("Error fetching comic by numeric ID:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});



// --------------------- User Authentication Routes ---------------------

// Sign Up Endpoint
app.post("/contact/signup", async (req, res) => {
  const { username, password, image_url } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Check if the username already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      username,
      password: hashedPassword,
      image_url: image_url || "", // Default empty string if no image URL is provided
      role: "user", // Default role is "user"
    };

    // Insert the new user into the database
    await usersCollection.insertOne(newUser);

    // Respond with a success message
    res.status(201).json({ message: "User registered successfully", role: newUser.role });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ error: "An error occurred during signup. Please try again." });
  }
});


// Login Endpoint
app.post("/contact/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Return role on successful login
    res.status(200).json({ role: user.role });
  } catch (err) {
    console.error("Error during login:", err);
    res
      .status(500)
      .json({ error: "An error occurred during login. Please try again." });
  }
});

// Fetch user profile picture by username
app.get("/contact/profile_picture/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await usersCollection.findOne({ username });

    if (user && user.image_url) {
      res.json({ image_url: user.image_url }); // Return the image_url
    } else {
      res.status(404).json({ error: "User not found or no profile picture" });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "An error occurred while fetching the user." });
  }
});

// Update User Endpoint (Backend)
app.put("/contact/update/:username", async (req, res) => {
  const { username } = req.params;
  const { newUsername, newPassword, newImageUrl } = req.body;

  // Validate input
  if (!newUsername && !newPassword && !newImageUrl) {
    return res.status(400).json({ error: "At least one field (username, password, imageUrl) is required to update" });
  }

  try {
    // Find the user by the old username
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If new username is provided, check if it already exists
    if (newUsername && newUsername !== username) {
      const existingUser = await usersCollection.findOne({ username: newUsername });
      if (existingUser) {
        return res.status(409).json({ error: "New username is already taken" });
      }
    }

    // Update user details
    const updateFields = {};
    if (newUsername) updateFields.username = newUsername;
    if (newPassword) {
      // Hash the new password using bcrypt (default salt rounds)
      updateFields.password = await bcrypt.hash(newPassword, 10); // 10 is the default salt rounds in bcrypt
    }
    if (newImageUrl) updateFields.image_url = newImageUrl;

    // Perform the update
    const result = await usersCollection.updateOne(
      { username }, // Find the user by the old username
      { $set: updateFields } // Update only the provided fields
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "No changes were made" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error during user update:", err);
    res.status(500).json({ error: "An error occurred during the update. Please try again." });
  }
});


// Delete User by Username Endpoint
app.delete("/contact/delete/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Attempt to delete the user from the database by username
    const result = await usersCollection.deleteOne({ username });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return success message if user is deleted
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "An error occurred while deleting the user" });
  }
});

// ------------------------ Comment Routes -------------------------------

// Route to fetch all comments for a comic
app.get('/comics/:comicId/comments', async (req, res) => {
  const { comicId } = req.params;

  try {
    const comments = await commentsCollection
      .find({ comicId: parseInt(comicId, 10) }) // Ensure comicId is parsed to number
      .sort({ createdAt: -1 })
      .toArray(); // Convert to array to return the results

    res.json(comments);
  } catch (error) {
    res.status(500).send("Failed to fetch comments: " + error.message);
  }
});


// Route to submit a new comment
app.post('/comics/:comicId/comments', async (req, res) => {
  const { comicId } = req.params;
  const { userId, text } = req.body;

  try {
    // Create the new comment object
    const newComment = {
      comicId: parseInt(comicId, 10), // Ensure comicId is a number
      userId: parseInt(userId, 10),   // Ensure userId is a number
      text,
      createdAt: new Date()  // Timestamp when the comment was created
    };

    // Insert the comment into the collection
    await commentsCollection.insertOne(newComment);

    // Fetch and return updated comments list for the comic
    const comments = await commentsCollection
      .find({ comicId: parseInt(comicId, 10) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(comments);
  } catch (error) {
    res.status(500).send("Failed to submit comment: " + error.message);
  }
});

//--------------------Save to Library-------------------------------------


// Route to add a comic to a user's library
app.post('/user/library/:userId', async (req, res) => {
  const { userId } = req.params;
  const { comicId } = req.body; // comicId from the frontend

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.savedComics.includes(comicId)) {
      return res.status(400).json({ error: "Comic already in library" });
    }

    // Add comicId to the savedComics array
    user.savedComics.push(comicId);
    await user.save();

    res.status(200).json({ message: "Comic added to library" });
  } catch (error) {
    res.status(500).json({ error: "Error saving comic to library" });
  }
});

// Route to get a user's saved comics
app.get('/user/library/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('savedComics'); // Populate with comic data
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.savedComics);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user's library" });
  }
});
