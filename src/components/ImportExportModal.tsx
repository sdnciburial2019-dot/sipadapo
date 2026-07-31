import React, { useState, useRef } from 'react';
import { 
  X, 
  FileUp, 
  Download, 
  FileSpreadsheet, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  FileCode,
  Table,
  Trash2,
  ShieldAlert
} from 'lucide-react';
import { Student } from '../types';
import { exportToExcel, parseTsvOrCsv, parseExcelFile, downloadExcelTemplate, saveStudents } from '../utils/storage';
import { clearAllStudentsFromFirestore, saveAllStudentsToFirestore } from '../lib/firebase';

interface ImportExportModalProps {
  students: Student[];
  onStudentsUpdated: (newStudents: Student[]) => void;
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  students,
  onStudentsUpdated,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'backup'>('import');
  const [importMode, setImportMode] = useState<'excel' | 'paste'>('excel');
  const [pastedText, setPastedText] = useState('');
  const [importedPreview, setImportedPreview] = useState<Partial<Student>[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setIsLoadingFile(true);
    setMsg(null);

    try {
      let parsed: Partial<Student>[] = [];
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        parsed = parseTsvOrCsv(text);
      } else {
        parsed = await parseExcelFile(file);
      }

      if (parsed.length > 0) {
        setImportedPreview(parsed);
        setMsg({ type: 'success', text: `Berhasil membaca ${parsed.length} baris data siswa dari file "${file.name}".` });
      } else {
        setMsg({ type: 'error', text: 'File Excel kosong atau format kolom tidak sesuai.' });
      }
    } catch (err) {
      console.error('File import error:', err);
      setMsg({ type: 'error', text: 'Gagal membaca file Excel. Pastikan file dalam format .xlsx / .xls yang valid.' });
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleParsePastedText = () => {
    if (!pastedText.trim()) return;
    const parsed = parseTsvOrCsv(pastedText);
    if (parsed.length > 0) {
      setImportedPreview(parsed);
      setMsg({ type: 'success', text: `Berhasil memproses ${parsed.length} data siswa dari teks.` });
    } else {
      setMsg({ type: 'error', text: 'Format teks tidak dikenali atau kosong.' });
    }
  };

  const handleApplyImport = () => {
    if (importedPreview.length === 0) return;
    const completeStudents: Student[] = importedPreview.map((item, idx) => ({
      id: `std-imp-${Date.now()}-${idx}`,
      rombel: item.rombel || '1 A',
      namaSiswa: item.namaSiswa || `Siswa Baru ${idx + 1}`,
      nipd: item.nipd || '',
      jk: item.jk || 'Laki-laki',
      nisn: item.nisn || '',
      ttl: item.ttl || '',
      nik: item.nik || '',
      agama: item.agama || 'Islam',
      alamat: item.alamat || '',
      kecamatan: item.kecamatan || 'Kec. Lembang',
      kodePos: item.kodePos || '40391',
      jenisTinggal: item.jenisTinggal || 'Orang Tua',
      transportasi: item.transportasi || 'Motor',
      hp: item.hp || '',
      email: item.email || '',
      penerimaKps: item.penerimaKps || 'Tidak',
      noKps: item.noKps || '',
      namaAyah: item.namaAyah || '',
      tahunLahirAyah: item.tahunLahirAyah || '',
      pendAyah: item.pendAyah || 'SMA Sederajat',
      pekerjaanAyah: item.pekerjaanAyah || 'Buruh',
      penghasilanAyah: item.penghasilanAyah || '1.000.000 - 1.999.999',
      nikAyah: item.nikAyah || '',
      namaIbu: item.namaIbu || '',
      tahunLahirIbu: item.tahunLahirIbu || '',
      pendIbu: item.pendIbu || 'SMA Sederajat',
      pekerjaanIbu: item.pekerjaanIbu || 'Tidak Bekerja',
      penghasilanIbu: item.penghasilanIbu || 'Tidak Berpenghasilan',
      nikIbu: item.nikIbu || '',
      penerimaKip: item.penerimaKip || 'Tidak',
      nomorKip: item.nomorKip || '',
      aktaLahir: item.aktaLahir || '',
      layakPip: item.layakPip || 'Tidak',
      alasanLayakPip: item.alasanLayakPip || '',
      sekolahAsal: item.sekolahAsal || 'RA/TK',
      anakKe: item.anakKe || '1',
      noKK: item.noKK || '',
      beratBadan: item.beratBadan || '20',
      tinggiBadan: item.tinggiBadan || '120',
      lingkarKepala: item.lingkarKepala || '50',
      jmlSaudara: item.jmlSaudara || '0',
      jarakSekolahKM: item.jarakSekolahKM || '0.5'
    }));

    const merged = [...students, ...completeStudents];
    saveStudents(merged);
    onStudentsUpdated(merged);
    setMsg({ type: 'success', text: `${completeStudents.length} siswa berhasil ditambahkan ke database.` });
    setImportedPreview([]);
    setPastedText('');
    setSelectedFileName('');
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [confirmInputText, setConfirmInputText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClearDatabase = async () => {
    if (confirmInputText.trim().toUpperCase() !== 'HAPUS') {
      alert("Kata kunci konfirmasi tidak sesuai. Harap ketik 'HAPUS' untuk mengonfirmasi.");
      return;
    }

    setIsDeleting(true);
    try {
      await clearAllStudentsFromFirestore();
      saveStudents([]);
      onStudentsUpdated([]);
      setMsg({ type: 'success', text: 'Seluruh data murid telah berhasil dihapus dari database lokal & cloud.' });
      setShowClearConfirm(false);
      setConfirmInputText('');
    } catch (err) {
      console.error('Gagal menghapus database:', err);
      saveStudents([]);
      onStudentsUpdated([]);
      setMsg({ type: 'success', text: 'Data murid di penyimpanan lokal telah dikosongkan.' });
      setShowClearConfirm(false);
      setConfirmInputText('');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadBackupJson = () => {
    const jsonStr = JSON.stringify(students, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_dapodik_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold">Import / Export & Backup Database</h2>
              <p className="text-xs text-slate-400">Kelola pertukaran data Excel (.xlsx / .xls) & Backup JSON</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'import' ? 'bg-slate-900 text-emerald-400' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileUp className="w-3.5 h-3.5" />
            1. Import Data Excel (.xlsx)
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'export' ? 'bg-slate-900 text-emerald-400' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            2. Export ke Excel (.xlsx)
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'backup' ? 'bg-slate-900 text-emerald-400' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            3. Backup & Reset Database
          </button>
        </div>

        {/* Status Message */}
        {msg && (
          <div className={`p-3 text-xs flex items-center gap-2 border-b ${
            msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700 bg-slate-50/50">
          {/* TAB 1: IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              {/* Import Mode Switcher */}
              <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setImportMode('excel')}
                  className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    importMode === 'excel' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Upload File Excel (.xlsx / .xls)
                </button>
                <button
                  onClick={() => setImportMode('paste')}
                  className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    importMode === 'paste' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  Salin & Tempel Teks
                </button>
              </div>

              {/* Mode 1: Excel File Upload */}
              {importMode === 'excel' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                    <div>
                      <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                        <Table className="w-4 h-4 text-emerald-600" />
                        Unduh Template Excel Standar Dapodik
                      </h4>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Gunakan format template ini untuk mengisi data siswa sebelum diunggah.
                      </p>
                    </div>
                    <button
                      onClick={downloadExcelTemplate}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Template (.xlsx)</span>
                    </button>
                  </div>

                  <div 
                    className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".xlsx, .xls, .csv"
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Pilih atau Seret File Excel (.xlsx / .xls)
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Mendukung file Excel dari Dapodik atau format spreadsheet Microsoft Excel / Google Sheets
                    </p>
                    {selectedFileName && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>{selectedFileName}</span>
                      </div>
                    )}
                    {isLoadingFile && (
                      <p className="text-xs text-amber-600 mt-2 font-medium animate-pulse">
                        Membaca data dari file Excel...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Mode 2: Paste Text */}
              {importMode === 'paste' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="font-semibold block text-slate-800">
                    Salin & Tempel Baris Tabel dari Ms Excel / Aplikasi Dapodik:
                  </label>
                  <textarea
                    rows={6}
                    value={pastedText}
                    onChange={e => setPastedText(e.target.value)}
                    placeholder="Format Kolom Dapodik Standar (pisahkan dengan tab/koma):
1 A	AGHNIA PUTRI SUBAGJA	262701002	Perempuan	3205529880..."
                    className="w-full p-3 border border-slate-300 rounded-lg text-xs font-mono"
                  />

                  <button
                    onClick={handleParsePastedText}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg cursor-pointer"
                  >
                    Pratinjau Data Impor
                  </button>
                </div>
              )}

              {/* Preview Section */}
              {importedPreview.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Pratinjau Impor ({importedPreview.length} Siswa):
                    </h4>
                    <button
                      onClick={handleApplyImport}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm cursor-pointer"
                    >
                      + Terapkan & Masukkan ke Database
                    </button>
                  </div>

                  <div className="overflow-x-auto max-h-48 border rounded">
                    <table className="w-full text-left text-[11px] divide-y">
                      <thead className="bg-slate-100 font-bold text-slate-700">
                        <tr>
                          <th className="p-2">Rombel</th>
                          <th className="p-2">Nama Siswa</th>
                          <th className="p-2">NISN</th>
                          <th className="p-2">JK</th>
                          <th className="p-2">Ayah</th>
                          <th className="p-2">Ibu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {importedPreview.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-mono">{item.rombel}</td>
                            <td className="p-2 font-bold">{item.namaSiswa}</td>
                            <td className="p-2 font-mono">{item.nisn}</td>
                            <td className="p-2">{item.jk}</td>
                            <td className="p-2">{item.namaAyah}</td>
                            <td className="p-2">{item.namaIbu}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPORT */}
          {activeTab === 'export' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 text-center">
              <FileSpreadsheet className="w-12 h-12 text-emerald-600 mx-auto" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Export Data Siswa ke Format Excel (.xlsx)</h3>
                <p className="text-slate-500 mt-1 max-w-md mx-auto">
                  Unduh seluruh database {students.length} peserta didik ke dalam file spreadsheet Microsoft Excel (.xlsx) standar Dapodik.
                </p>
              </div>

              <button
                onClick={() => exportToExcel(students, `dapodik_siswa_${new Date().toISOString().slice(0,10)}.xlsx`)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Unduh File Excel .xlsx ({students.length} Siswa)</span>
              </button>
            </div>
          )}

          {/* TAB 3: BACKUP & DATABASE MANAGEMENT */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Unduh Backup File JSON</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Simpan cadangan lengkap data {students.length} murid ke file format JSON.</p>
                </div>
                <button
                  onClick={handleDownloadBackupJson}
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-lg cursor-pointer shrink-0"
                >
                  Unduh JSON
                </button>
              </div>

              {/* DANGER ZONE: Hapus Database */}
              <div className="bg-rose-50 p-5 rounded-xl border-2 border-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-rose-900 text-sm flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    Hapus / Kosongkan Database Murid
                  </h4>
                  <p className="text-rose-700 text-xs">
                    Menghapus SELURUH data murid ({students.length} siswa) secara permanen dari database lokal & Firebase Cloud.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Database
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS DATABASE */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-60 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-black text-rose-950">Konfirmasi Hapus Seluruh Database</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tindakan ini akan <strong>MENGHAPUS PERMANEN {students.length} DATA MURID</strong> dari penyimpanan lokal browser dan server Firebase Cloud.
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold">⚠️ Ketik kata 'HAPUS' di bawah ini untuk mengonfirmasi:</p>
              <input
                type="text"
                value={confirmInputText}
                onChange={e => setConfirmInputText(e.target.value)}
                placeholder="Ketik HAPUS"
                className="w-full p-2 bg-white border border-amber-300 rounded-lg text-center font-black tracking-widest uppercase text-rose-700"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowClearConfirm(false);
                  setConfirmInputText('');
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={confirmInputText.trim().toUpperCase() !== 'HAPUS' || isDeleting}
                onClick={handleClearDatabase}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer ${
                  confirmInputText.trim().toUpperCase() === 'HAPUS' && !isDeleting
                    ? 'bg-rose-600 hover:bg-rose-500 ring-2 ring-rose-600/30'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Semua Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

