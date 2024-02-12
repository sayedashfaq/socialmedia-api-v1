import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config as configDotenv } from "dotenv";
import { connectDb } from "./config/connectDB.js";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json' assert { type: 'json' };
import multer from "multer";

//Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
// import uploadRoute from "./routes/upload.js";

const app = express();

//dotenv Config
configDotenv();

//Cors Policy
app.use(cors());

//json midleware
app.use(express.json());

//bodyparser
app.use(bodyParser.urlencoded({ extended: true }));


//.env Variables
const port = process.env.PORT;
const db_url = process.env.DATABASE_URL;

//DB Connection
connectDb(db_url);

//Server Creating
app.listen(port, () => console.log(`Server running on ${port}`));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
app.post("/createPost", upload.single("file"), async (req, res) => {
    const { desc, userId } = req.body;
    const file = req.file;
  
    if (!file) return res.status(400).json({ message: "File upload is required" });
  
    try {
      const newPost = new postModel({
        userId,
        desc,
        image: file.path, 
      });
  
      await newPost.save();
      res.status(200).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating post", error });
    }
  });


app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", postRoutes);

