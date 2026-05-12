import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { google } from "googleapis";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Google Auth setup
  const getAuth = () => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set in environment");
    }
    return apiKey;
  };

  const getSheets = () => google.sheets({ version: "v4", auth: getAuth() });
  const getDocs = () => google.docs({ version: "v1", auth: getAuth() });
  const getDrive = () => google.drive({ version: "v3", auth: getAuth() });

  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok",
      config: {
        hasSheetId: !!process.env.GOOGLE_SHEET_ID,
        hasApiKey: !!process.env.GOOGLE_API_KEY,
        spreadsheetId: process.env.GOOGLE_SHEET_ID ? `${process.env.GOOGLE_SHEET_ID.substring(0, 5)}...` : null
      }
    });
  });

  app.get("/api/sheets/data", async (req, res) => {
    try {
      if (!SPREADSHEET_ID) {
        return res.status(400).json({ error: "GOOGLE_SHEET_ID not configured" });
      }
      const sheets = getSheets();
      const range = req.query.range as string || "Reports!A:Z";
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
      });

      res.json(response.data.values || []);
    } catch (error: any) {
      console.error("Sheets Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sheets/append", async (req, res) => {
    try {
      if (!SPREADSHEET_ID) {
        return res.status(400).json({ error: "GOOGLE_SHEET_ID not configured" });
      }
      const sheets = getSheets();
      const { range, values } = req.body;

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [values],
        },
      });

      res.json(response.data);
    } catch (error: any) {
      console.error("Sheets Append Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Export to Google Doc
  app.post("/api/docs/create", async (req, res) => {
    try {
      const { title, content } = req.body;
      const docs = getDocs();
      
      // Note: Creation usually requires OAuth. This is a placeholder for when the user provides a service account or oauth token.
      const response = await docs.documents.create({
        requestBody: { title }
      });

      const documentId = response.data.documentId;
      if (documentId && content) {
        await docs.documents.batchUpdate({
          documentId,
          requestBody: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: content
                }
              }
            ]
          }
        });
      }

      res.json({ documentId, url: `https://docs.google.com/document/d/${documentId}/edit` });
    } catch (error: any) {
      console.error("Docs Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
