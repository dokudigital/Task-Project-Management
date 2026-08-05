import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Assistance Endpoint
  app.post('/api/gemini/assist', async (req, res) => {
    try {
      const { type, context, prompt } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY tidak dikonfigurasi. Silakan tambahkan GEMINI_API_KEY di Secrets Settings.'
        });
      }

      let systemInstruction = 'Anda adalah Asisten AI Manajemen Proyek & Tugas Notion yang profesional, efisien, dan fasih berbahasa Indonesia.';
      let userPrompt = prompt || '';

      if (type === 'generate_subtasks') {
        systemInstruction += ' Tugas Anda adalah membuat 3-5 subtask logis dan terstruktur berdasarkan judul/deskripsi tugas yang diberikan. Kembalikan dalam format JSON array berisi string.';
        userPrompt = `Buatkan daftar subtask konkret untuk tugas berikut: "${context?.title}". Deskripsi: "${context?.description || ''}"`;
      } else if (type === 'summarize_note') {
        systemInstruction += ' Buatkan ringkasan eksekutif poin-poin utama dari catatan proyek ini.';
        userPrompt = `Ringkas catatan proyek berikut dalam 3-4 poin bullet berharga:\n\n${context?.text}`;
      } else if (type === 'project_plan') {
        systemInstruction += ' Buatkan draft rancangan proyek (PRD) mencakup Tujuan, Milestone Utama, dan Risiko Utama.';
        userPrompt = `Buatkan rancangan proyek untuk: "${context?.projectName}". Kategori: ${context?.category}. Deskripsi: ${context?.description}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      res.json({
        success: true,
        text: response.text || 'Tidak ada tanggapan yang dihasilkan.'
      });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({
        error: error.message || 'Gagal memproses permintaan AI Gemini.'
      });
    }
  });

  // Vite Dev Server Middleware or Static Production Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Notion Project Manager running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
