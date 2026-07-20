import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Increase request body size limits to accommodate base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// 1. Image Identification Endpoint
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { image, category } = req.body; // base64 representation of image & category (fridge, freezer, dry_cabinet)

    if (!image) {
      return res.status(400).json({ error: "Missing image data in request." });
    }

    const compartment = category || "fridge";
    const ai = getAiClient();

    // Extract mime type and clean base64 data
    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    let mimeType = "image/jpeg";
    let base64Data = image;

    if (match) {
      mimeType = match[1];
      base64Data = match[2];
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: `Analyze this image of a ${compartment} compartment.
Identify all visible food items, ingredients, raw foods, condiments, or groceries.
For each item, estimate:
1. The exact name of the item.
2. Your identification confidence score (between 0.0 and 1.0).
3. The remaining shelf life in days (approximate).
4. Expiry concern level ("high", "medium", or "low").
5. Estimated volume/quantity of the item in hand.

Output a clean list of ingredients in JSON format following the schema precisely.
Do not invent or assume ingredients that are completely invisible. If the image is blurry, dim, or unclear, assign lower confidence scores.`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, textPart],
      config: {
        systemInstruction: "You are Plated, an expert food-recognition and refrigerator vision assistant. You return ONLY valid JSON output conforming to the schema requested, without explanations or markdown.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Common name of food ingredient, e.g. 'Eggs', 'Spinach', 'Milk'." },
              confidence: { type: Type.NUMBER, description: "Between 0.0 and 1.0" },
              quantity: { type: Type.STRING, description: "e.g. '4 pieces', '150g', 'Half bottle'." },
              category: { type: Type.STRING, description: "fridge, freezer, or dry_cabinet" },
              shelf_life_days: { type: Type.INTEGER, description: "Estimated remaining days before spoiling" },
              expiry_concern: { type: Type.STRING, description: "high, medium, or low" }
            },
            required: ["name", "confidence", "quantity", "category", "shelf_life_days", "expiry_concern"]
          }
        }
      }
    });

    const resultText = response.text || "[]";
    const items = JSON.parse(resultText);

    res.json({ items });
  } catch (error: any) {
    console.error("Error in analyze-image:", error);
    res.status(500).json({ error: error.message || "Failed to analyze image." });
  }
});

// 2. Customized AI Nutrition & Meal Planning Endpoint
app.post("/api/generate-meal", async (req, res) => {
  try {
    const { userProfile, inventory } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: "User profile data is required." });
    }

    const ai = getAiClient();

    const goal = userProfile.goal || "Healthy";
    const age = userProfile.age || 30;
    const height = userProfile.height || "175cm";
    const weight = userProfile.weight || "70kg";
    const activity_level = userProfile.activity_level || "Moderate";
    const cuisine_preference = userProfile.cuisine_preference || "Italian";
    const meal_mode = userProfile.meal_mode || "Single Meal";

    const fridge_scan_json = JSON.stringify(inventory?.fridge || []);
    const freezer_scan_json = JSON.stringify(inventory?.freezer || []);
    const dry_cabinet_scan_json = JSON.stringify(inventory?.dry_cabinet || []);

    const userPrompt = `
Generate the best possible meal output based on available ingredients and user goal.

User profile:
- Goal: ${goal}
- Age: ${age}
- Height: ${height}
- Weight: ${weight}
- Activity level: ${activity_level}
- Cuisine preference: ${cuisine_preference}
- Meal mode: ${meal_mode}

Available ingredients from images:
Fridge scan results: ${fridge_scan_json}
Freezer scan results: ${freezer_scan_json}
Dry cabinet scan results: ${dry_cabinet_scan_json}

Task:
Generate one tailored recipe/meal plan matching the user's nutritional profile, optimizing for available ingredients to prevent waste.
Return a single JSON object matching the requested schema precisely.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: `You are Plated, an expert AI nutrition and meal-planning assistant.
Your job:
1. Analyze user goals, preferences, and available ingredients.
2. Analyze uploaded fridge/freezer/pantry images (provided as text inventories).
3. Detect food items with confidence scores.
4. Generate one meal, meal prep idea, or weekly meal plan based on 'meal_mode'.
5. Optimize for the user's nutrition goal and available ingredients.
6. Return only valid JSON.

Rules:
- Use the user's dietary goal and activity level to balance calories and macronutrients.
- Prioritize ingredients that are already available (especially fridge/freezer items).
- Reduce food waste by using items that expire soon.
- Respect cuisine preference. If unknown, choose the best match.
- If user wants weight loss, slightly increase protein and vegetables, reduce calories and carbs.
- If user wants muscle gain, increase protein and total calories.
- Estimate a health score from 1 to 100.
- Do not invent ingredients that are not visible unless they are standard pantry basics (e.g., salt, black pepper, water, oil).
- If the image content is unclear, state so and lower confidence score.
- Output JSON ONLY, matching the requested schema exactly. No markdown fences, no formatting prefixes.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            user_summary: {
              type: Type.OBJECT,
              properties: {
                goal: { type: Type.STRING },
                age: { type: Type.INTEGER },
                height: { type: Type.STRING },
                weight: { type: Type.STRING },
                activity_level: { type: Type.STRING },
                cuisine_preference: { type: Type.STRING },
                meal_mode: { type: Type.STRING }
              },
              required: ["goal", "age", "height", "weight", "activity_level", "cuisine_preference", "meal_mode"]
            },
            detected_items: {
              type: Type.OBJECT,
              properties: {
                fridge: { type: Type.ARRAY, items: { type: Type.STRING } },
                freezer: { type: Type.ARRAY, items: { type: Type.STRING } },
                dry_cabinet: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["fridge", "freezer", "dry_cabinet"]
            },
            meal: {
              type: Type.OBJECT,
              properties: {
                meal_name: { type: Type.STRING },
                cuisine_type: { type: Type.STRING },
                health_score: { type: Type.INTEGER },
                calories: { type: Type.INTEGER },
                protein_g: { type: Type.INTEGER },
                carbs_g: { type: Type.INTEGER },
                fat_g: { type: Type.INTEGER },
                ingredients: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      amount: { type: Type.STRING },
                      category: { type: Type.STRING, description: "fridge, freezer, or pantry" },
                      use_reason: { type: Type.STRING, description: "Reason for selection, e.g. uses expiring spinach" }
                    },
                    required: ["name", "amount", "category", "use_reason"]
                  }
                },
                preparation: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                substitutions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["meal_name", "cuisine_type", "health_score", "calories", "protein_g", "carbs_g", "fat_g", "ingredients", "preparation", "substitutions"]
            },
            confidence: { type: Type.NUMBER, description: "Your recipe alignment confidence from 0 to 100" },
            notes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["user_summary", "detected_items", "meal", "confidence", "notes"]
        }
      }
    });

    const resultText = response.text || "{}";
    const responseJson = JSON.parse(resultText);

    res.json(responseJson);
  } catch (error: any) {
    console.error("Error in generate-meal:", error);
    res.status(500).json({ error: error.message || "Failed to generate customized recipe." });
  }
});

// Vite middleware & Static asset handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Plated OS] Server listening on http://localhost:${PORT} under ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
