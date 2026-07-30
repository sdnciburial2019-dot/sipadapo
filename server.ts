import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Route: AI Data Validation & Insights for Student Record
app.post("/api/gemini/analyze-student", async (req, res) => {
  try {
    const { student, allStudents } = req.body;
    if (!student) {
      return res.status(400).json({ error: "Data siswa tidak ditemukan." });
    }

    const ai = getGeminiClient();
    const prompt = `Sebagai pakar Administrasi Sekolah dan Dapodik (Data Pokok Pendidikan Indonesia), analisislah data siswa berikut dan berikan laporan kelengkapan data, potensi kesalahan/duplikasi, serta kriteria kelayakan Bantuan PIP/KPS jika ada.

Data Siswa:
${JSON.stringify(student, null, 2)}

Format Jawaban dalam JSON valid:
{
  "completenessScore": 85, // Skor kelengkapan 0-100%
  "statusAlert": "Sangat Lengkap / Perlu Melengkapi Data / Data Kritis Kosong",
  "missingFields": ["Nomor HP Ortu", "Nomor Registrasi Akta Lahir"], // daftar field penting yang belum diisi
  "dataWarnings": ["Nomor NIK kurang dari 16 digit", "NISN belum terisi"], // daftar potensi error
  "pipAssessment": {
    "recommended": true, // rekomendasi layak PIP
    "reason": "Penjelasan singkat berdasarkan penghasilan orang tua dan status KPS/KIP"
  },
  "summaryNotes": "Catatan singkat 2-3 kalimat mengenai kelayakan administrasi siswa ini untuk tahun ajaran baru."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Error analyzing student:", err);
    res.status(500).json({ error: err.message || "Gagal melakukan analisis AI." });
  }
});

// API Route: Generate Official School Surat Keterangan
app.post("/api/gemini/generate-letter", async (req, res) => {
  try {
    const { letterType, student, schoolInfo, customNote } = req.body;
    if (!student || !letterType) {
      return res.status(400).json({ error: "Parameter jenis surat atau data siswa tidak lengkap." });
    }

    const ai = getGeminiClient();
    const prompt = `Buatkan draf teks surat resmi sekolah untuk SD/Sekolah Dasar di Indonesia dengan format baku dan bahasa baku kedinasan.

Jenis Surat: ${letterType} (misal: "Surat Keterangan Aktif Siswa", "Surat Usulan Beasiswa PIP", "Surat Keterangan Kelakuan Baik", "Surat Keterangan Pindah Sekolah")
Data Sekolah: ${JSON.stringify(schoolInfo || { name: "SD NEGERI CIBURIAL", npsn: "20200000", address: "Kp. Ciburial Desa Cibogo Kec. Lembang", kepalaSekolah: "Hj. Ratna M.Pd", nipKepala: "197508122000032001" })}
Data Siswa: ${JSON.stringify(student)}
Catatan Khusus: ${customNote || "Tidak ada"}

Berikan output JSON:
{
  "nomorSurat": "421.2/045/SDN-CBR/VII/2026",
  "perihal": "Surat Keterangan ...",
  "pembuka": "Teks paragraf pembuka resmi...",
  "isiPerernyataan": "Teks isi utama yang menerangkan bahwa siswa bernama ... lahir di ... NISN ... adalah benar...",
  "penutup": "Teks paragraf penutup...",
  "tujuanMaksud": "Keperluan surat (contoh: Persyaratan Pengajuan Bantuan PIP / Syarat Pendaftaran Lomba / Dll)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Error generating letter:", err);
    res.status(500).json({ error: err.message || "Gagal membuat draf surat." });
  }
});

// API Route: Smart Parse Raw Text into Student Data
app.post("/api/gemini/parse-raw", async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) {
      return res.status(400).json({ error: "Teks mentah kosong." });
    }

    const ai = getGeminiClient();
    const prompt = `Anda adalah parser data Dapodik sekolah. Ekstrak teks mentah pendaftaran atau baris tabel siswa berikut menjadi objek JSON berpola struktur Dapodik.

Teks Mentah:
"""
${rawText}
"""

Kembalikan objek JSON tunggal dengan atribut berikut (isi dengan string kosong "" jika tidak ditemukan):
{
  "rombel": "1 A",
  "namaSiswa": "Nama Siswa",
  "nipd": "2627...",
  "jk": "Laki-laki" | "Perempuan",
  "nisn": "320...",
  "ttl": "Bandung, 10 Maret 2020",
  "nik": "3217...",
  "agama": "Islam",
  "alamat": "...",
  "kecamatan": "Kec. Lembang",
  "kodePos": "40391",
  "jenisTinggal": "Orang Tua",
  "transportasi": "Motor",
  "hp": "085...",
  "email": "...",
  "namaAyah": "...",
  "tahunLahirAyah": "1995",
  "pendAyah": "SMA Sederajat",
  "pekerjaanAyah": "Buruh",
  "penghasilanAyah": "1.000.000 - 1.999.999",
  "nikAyah": "...",
  "namaIbu": "...",
  "tahunLahirIbu": "1997",
  "pendIbu": "SMA Sederajat",
  "pekerjaanIbu": "Tidak Bekerja",
  "penghasilanIbu": "Tidak Berpenghasilan",
  "nikIbu": "...",
  "aktaLahir": "...",
  "sekolahAsal": "...",
  "anakKe": "1",
  "noKK": "...",
  "beratBadan": "18",
  "tinggiBadan": "117",
  "lingkarKepala": "50",
  "jmlSaudara": "0"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Error parsing raw text:", err);
    res.status(500).json({ error: err.message || "Gagal memproses data mentah." });
  }
});

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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
