import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Imanies Coffee Management System" });
  });

  // AI Daily Report Generator API endpoint
  app.post("/api/generate-ai-report", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ 
          error: "API key GEMINI_API_KEY tidak ditemui. Sila konfigurasi di Tetapan AI Studio." 
        });
      }

      const { date, totalSales, totalExpenses, netProfit, profitMargin, totalCups, topSelling, ordersSummary } = req.body;

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
Anda adalah seorang Perunding Perniagaan Kafe & Kopi Profesional untuk "Imanies Coffee" (Jenama Kopi Tempatan Malaysia).
Sila analisis data jualan harian berikut dan jana Laporan Eksekutif Keuntungan Harian ringkas, profesional dan berwawasan dalam bahasa Melayu.

DATA JUALAN HARIAN (${date}):
- Jumlah Jualan Kasar: RM ${Number(totalSales || 0).toFixed(2)}
- Jumlah Kos Bahan/Operasi (COGS): RM ${Number(totalExpenses || 0).toFixed(2)}
- Keuntungan Bersih: RM ${Number(netProfit || 0).toFixed(2)}
- Peratusan Margin Keuntungan: ${Number(profitMargin || 0).toFixed(1)}%
- Jumlah Cawan Terjual: ${totalCups || 0} cawan
- Minuman Paling Laris: ${topSelling || 'N/A'}
- Ringkasan Pesanan: ${JSON.stringify(ordersSummary || [])}

Sila formatkan laporan dalam struktur Markdown berhias kemas mengandungi:
1. 📊 **Ringkasan Eksekutif Prestasi Hari Ini**
2. 💰 **Analisis Keuntungan & Margin Kos**
3. ☕ **Analisis Trend Minuman Laris**
4. 💡 **3 Cadangan Strategik untuk Meningkatkan Jualan & Penjimatan Kos Esok Day**

Pastikan nada ramah, bersemangat, profesional, dan relevan dengan industri kopi tempatan Malaysia.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const reportText = response.text || "Gagal menjana laporan AI.";
      return res.json({ success: true, report: reportText });
    } catch (err: any) {
      console.error("AI Report Generation Error:", err);
      return res.status(500).json({ 
        error: "Ralat semasa menjana laporan AI: " + (err.message || "Ralat tidak diketahui") 
      });
    }
  });

  // Vite middleware for dev / static for prod
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
    console.log(`[Imanies Coffee Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
