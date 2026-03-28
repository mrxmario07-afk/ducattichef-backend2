import express from "express";
import multer from "multer";
import OpenAI from "openai";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    const imageBase64 = fs.readFileSync(req.file.path, {
      encoding: "base64",
    });

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Identifique o prato e gere nome, ingredientes e modo de preparo detalhado." },
            {
              type: "input_image",
              image_base64: imageBase64
            }
          ]
        }
      ]
    });

    res.json({ result: response.output_text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("🔥 Rodando"));
