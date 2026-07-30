import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Activity, 
  Scale, 
  Ruler, 
  Users, 
  Search, 
  Filter, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  RotateCcw,
  Bike,
  Home,
  Check
} from 'lucide-react';
import { Student } from '../types';
import { getStoredRombelList } from '../utils/storage';

interface PhysicalPeriodicalDataModalProps {
  students: Student[];
  onSaveStudents: (updatedStudents: Student[]) => void;
  onClose: () => void;
}

export const PhysicalPeriodicalDataModal: React.FC<PhysicalPeriodicalDataModalProps> = ({
  students,
  onSaveStudents,
  onClose,
}) => {
  // Local editable copy of students
  const [editableStudents, setEditableStudents] = useState<Student[]>([]);
  const [selectedRombel, setSelectedRombel] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Auto-fill state
  const [batchTransport, setBatchTransport] = useState<string>('Jalan kaki');
  const [batchTinggal, setBatchTinggal] = useState<string>('Bersama orang tua');
  const [batchJarak, setBatchJarak] = useState<string>('1');

  useEffect(() => {
    // Clone student array for safe editing
    setEditableStudents(JSON.parse(JSON.stringify(students)));
  }, [students]);

  const rombelList = getStoredRombelList();

  // Filtered student list
  const filteredStudents = editableStudents.filter(s => {
    const matchesRombel = selectedRombel === 'semua' || s.rombel === selectedRombel;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      s.namaSiswa.toLowerCase().includes(q) || 
      (s.nisn && s.nisn.includes(q)) || 
      (s.nipd && s.nipd.includes(q));
    return matchesRombel && matchesSearch;
  });

  // Handle field change for a specific student ID
  const handleFieldChange = (id: string, field: keyof Student, value: string) => {
    setIsSaved(false);
    setEditableStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Batch Auto-fill helper functions
  const applyBatchTransport = () => {
    setIsSaved(false);
    setEditableStudents(prev =>
      prev.map(s => {
        if (selectedRombel !== 'semua' && s.rombel !== selectedRombel) return s;
        if (!s.transportasi || s.transportasi.trim() === '') {
          return { ...s, transportasi: batchTransport };
        }
        return s;
      })
    );
  };

  const applyBatchTinggal = () => {
    setIsSaved(false);
    setEditableStudents(prev =>
      prev.map(s => {
        if (selectedRombel !== 'semua' && s.rombel !== selectedRombel) return s;
        if (!s.jenisTinggal || s.jenisTinggal.trim() === '') {
          return { ...s, jenisTinggal: batchTinggal };
        }
        return s;
      })
    );
  };

  const applyBatchJarak = () => {
    setIsSaved(false);
    setEditableStudents(prev =>
      prev.map(s => {
        if (selectedRombel !== 'semua' && s.rombel !== selectedRombel) return s;
        if (!s.jarakSekolahKM || s.jarakSekolahKM.trim() === '') {
          return { ...s, jarakSekolahKM: batchJarak };
        }
        return s;
      })
    );
  };

  const handleSaveAll = () => {
    onSaveStudents(editableStudents);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  // Stats
  const filledTbBbCount = filteredStudents.filter(
    s => s.tinggiBadan && parseFloat(s.tinggiBadan) > 0 && s.beratBadan && parseFloat(s.beratBadan) > 0
  ).length;

  const currentCardStudent = filteredStudents[cardIndex] || filteredStudents[0];

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header Modal */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-xl shadow-md">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Pengkinian Data Fisik & Periodik Murid
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Dapodik Periodik
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Update pengukuran Tinggi Badan, Berat Badan, Lingkar Kepala, Jarak Sekolah, Transportasi & Saudara secara cepat per Rombel.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveAll}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isSaved 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
              }`}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Filter Rombel, Search & Mode Toggle */}
        <div className="bg-slate-100 p-3.5 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Rombel Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-semibold text-slate-600">Rombel:</span>
              <select
                value={selectedRombel}
                onChange={e => {
                  setSelectedRombel(e.target.value);
                  setCardIndex(0);
                }}
                className="text-xs font-bold text-slate-800 focus:outline-none bg-transparent"
              >
                <option value="semua">Semua Rombel ({editableStudents.length})</option>
                {rombelList.map(r => {
                  const count = editableStudents.filter(s => s.rombel === r).length;
                  return (
                    <option key={r} value={r}>
                      Kelas {r} ({count} Murid)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama murid atau NISN..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-emerald-500 shadow-2xs"
              />
            </div>

            {/* Stat Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span>Terisi TB & BB: <strong>{filledTbBbCount}</strong> / {filteredStudents.length}</span>
            </div>
          </div>

          {/* View Mode Toggle Button (Table / Mode Entri Cepat per Kartu) */}
          <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tabel Spreadsheet
            </button>
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'card' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mode Pengukuran Per Murid
            </button>
          </div>
        </div>

        {/* Quick Batch Auto-Fill Tools (Collapsible / Banner) */}
        <div className="bg-amber-50/70 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Alat Pengisian Otomatis Data Kosong:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Auto Fill Transport */}
            <div className="flex items-center gap-1 bg-white border border-amber-300 rounded-lg px-2 py-1 shadow-2xs">
              <Bike className="w-3.5 h-3.5 text-amber-700" />
              <select
                value={batchTransport}
                onChange={e => setBatchTransport(e.target.value)}
                className="text-[11px] font-semibold text-slate-800 bg-transparent focus:outline-none"
              >
                <option value="Jalan kaki">Jalan kaki</option>
                <option value="Sepeda motor">Sepeda motor</option>
                <option value="Jemputan sekolah">Jemputan sekolah</option>
                <option value="Angkutan umum">Angkutan umum</option>
                <option value="Mobil pribadi">Mobil pribadi</option>
                <option value="Sepeda">Sepeda</option>
              </select>
              <button
                type="button"
                onClick={applyBatchTransport}
                className="text-[10px] font-bold bg-amber-600 hover:bg-amber-500 text-white px-2 py-0.5 rounded cursor-pointer"
                title="Isi Transportasi ke Murid yang Kosong"
              >
                Isi Transport
              </button>
            </div>

            {/* Auto Fill Tempat Tinggal */}
            <div className="flex items-center gap-1 bg-white border border-amber-300 rounded-lg px-2 py-1 shadow-2xs">
              <Home className="w-3.5 h-3.5 text-amber-700" />
              <select
                value={batchTinggal}
                onChange={e => setBatchTinggal(e.target.value)}
                className="text-[11px] font-semibold text-slate-800 bg-transparent focus:outline-none"
              >
                <option value="Bersama orang tua">Bersama orang tua</option>
                <option value="Wali">Wali</option>
                <option value="Kos">Kos</option>
                <option value="Asrama">Asrama</option>
              </select>
              <button
                type="button"
                onClick={applyBatchTinggal}
                className="text-[10px] font-bold bg-amber-600 hover:bg-amber-500 text-white px-2 py-0.5 rounded cursor-pointer"
                title="Isi Tempat Tinggal ke Murid yang Kosong"
              >
                Isi Tinggal
              </button>
            </div>

            {/* Auto Fill Jarak */}
            <div className="flex items-center gap-1 bg-white border border-amber-300 rounded-lg px-2 py-1 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-700">Jarak:</span>
              <input
                type="text"
                value={batchJarak}
                onChange={e => setBatchJarak(e.target.value)}
                className="w-10 text-[11px] font-bold text-slate-800 border-b border-amber-400 text-center focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">km</span>
              <button
                type="button"
                onClick={applyBatchJarak}
                className="text-[10px] font-bold bg-amber-600 hover:bg-amber-500 text-white px-2 py-0.5 rounded cursor-pointer"
                title="Isi Jarak Sekolah ke Murid yang Kosong"
              >
                Isi Jarak
              </button>
            </div>
          </div>
        </div>

        {/* Modal Main View */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <AlertCircle className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600">Tidak ada data murid yang sesuai filter Rombel/Pencarian.</p>
              <p className="text-xs text-slate-400">Silakan ubah pilihan Rombel atau kata kunci pencarian di atas.</p>
            </div>
          ) : viewMode === 'table' ? (
            /* ================= MODE 1: TABLE SPREADSHEET ================= */
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10">
                    <th className="p-2.5 text-center w-10">No</th>
                    <th className="p-2.5 min-w-[160px]">Nama Murid</th>
                    <th className="p-2.5 text-center w-16">Kelas</th>
                    <th className="p-2.5 text-center min-w-[90px]">
                      <div className="flex items-center justify-center gap-1 text-emerald-700">
                        <Ruler className="w-3 h-3" />
                        <span>Tinggi (cm)</span>
                      </div>
                    </th>
                    <th className="p-2.5 text-center min-w-[90px]">
                      <div className="flex items-center justify-center gap-1 text-emerald-700">
                        <Scale className="w-3 h-3" />
                        <span>Berat (kg)</span>
                      </div>
                    </th>
                    <th className="p-2.5 text-center min-w-[95px]">
                      <div className="flex items-center justify-center gap-1 text-emerald-700">
                        <Activity className="w-3 h-3" />
                        <span>Lingkar Kepala</span>
                      </div>
                    </th>
                    <th className="p-2.5 text-center min-w-[90px]">Jarak (km)</th>
                    <th className="p-2.5 text-center min-w-[80px]">Saudara</th>
                    <th className="p-2.5 text-center min-w-[70px]">Anak Ke</th>
                    <th className="p-2.5 min-w-[130px]">Transportasi</th>
                    <th className="p-2.5 min-w-[140px]">Jenis Tempat Tinggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredStudents.map((s, index) => {
                    const isCompleteFisik = 
                      Boolean(s.tinggiBadan && parseFloat(s.tinggiBadan) > 0) &&
                      Boolean(s.beratBadan && parseFloat(s.beratBadan) > 0);

                    return (
                      <tr 
                        key={s.id} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          !isCompleteFisik ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        <td className="p-2 text-center font-bold text-slate-500">{index + 1}</td>
                        <td className="p-2">
                          <div className="font-bold text-slate-900">{s.namaSiswa}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            NISN: {s.nisn || '-'} | {s.jk === 'Laki-laki' ? 'L' : 'P'}
                          </div>
                        </td>
                        <td className="p-2 text-center font-semibold text-slate-700">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] border border-slate-200">
                            {s.rombel}
                          </span>
                        </td>

                        {/* Tinggi Badan */}
                        <td className="p-1 text-center">
                          <input
                            type="number"
                            step="0.1"
                            value={s.tinggiBadan || ''}
                            onChange={e => handleFieldChange(s.id, 'tinggiBadan', e.target.value)}
                            placeholder="0"
                            className="w-full text-center px-2 py-1.5 border border-slate-300 rounded-lg font-bold text-emerald-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </td>

                        {/* Berat Badan */}
                        <td className="p-1 text-center">
                          <input
                            type="number"
                            step="0.1"
                            value={s.beratBadan || ''}
                            onChange={e => handleFieldChange(s.id, 'beratBadan', e.target.value)}
                            placeholder="0"
                            className="w-full text-center px-2 py-1.5 border border-slate-300 rounded-lg font-bold text-emerald-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </td>

                        {/* Lingkar Kepala */}
                        <td className="p-1 text-center">
                          <input
                            type="number"
                            step="0.1"
                            value={s.lingkarKepala || ''}
                            onChange={e => handleFieldChange(s.id, 'lingkarKepala', e.target.value)}
                            placeholder="0"
                            className="w-full text-center px-2 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </td>

                        {/* Jarak Sekolah (KM) */}
                        <td className="p-1 text-center">
                          <input
                            type="text"
                            value={s.jarakSekolahKM || ''}
                            onChange={e => handleFieldChange(s.id, 'jarakSekolahKM', e.target.value)}
                            placeholder="1"
                            className="w-full text-center px-2 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </td>

                        {/* Jml Saudara */}
                        <td className="p-1 text-center">
                          <input
                            type="number"
                            value={s.jmlSaudara || ''}
                            onChange={e => handleFieldChange(s.id, 'jmlSaudara', e.target.value)}
                            placeholder="0"
                            className="w-full text-center px-2 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </td>

                        {/* Anak Ke */}
                        <td className="p-1 text-center">
                          <input
                            type="number"
                            value={s.anakKe || ''}
                            onChange={e => handleFieldChange(s.id, 'anakKe', e.target.value)}
                            placeholder="1"
                            className="w-full text-center px-2 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </td>

                        {/* Transportasi */}
                        <td className="p-1">
                          <input
                            type="text"
                            list={`transport-list-${s.id}`}
                            value={s.transportasi || ''}
                            onChange={e => handleFieldChange(s.id, 'transportasi', e.target.value)}
                            placeholder="Alat transport..."
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-medium text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <datalist id={`transport-list-${s.id}`}>
                            <option value="Jalan kaki" />
                            <option value="Sepeda motor" />
                            <option value="Angkutan umum" />
                            <option value="Jemputan sekolah" />
                            <option value="Mobil pribadi" />
                            <option value="Sepeda" />
                          </datalist>
                        </td>

                        {/* Jenis Tempat Tinggal */}
                        <td className="p-1">
                          <input
                            type="text"
                            list={`tinggal-list-${s.id}`}
                            value={s.jenisTinggal || ''}
                            onChange={e => handleFieldChange(s.id, 'jenisTinggal', e.target.value)}
                            placeholder="Jenis tempat tinggal..."
                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-medium text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <datalist id={`tinggal-list-${s.id}`}>
                            <option value="Bersama orang tua" />
                            <option value="Wali" />
                            <option value="Kos" />
                            <option value="Asrama" />
                            <option value="Panti asuhan" />
                          </datalist>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* ================= MODE 2: CARD CHECKUP MODE ================= */
            currentCardStudent && (
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Stepper / Carousel Header */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <button
                    type="button"
                    disabled={cardIndex === 0}
                    onClick={() => setCardIndex(prev => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Murid Sebelumnya
                  </button>

                  <div className="text-center">
                    <span className="text-xs text-slate-500 font-semibold">
                      Murid Ke-{cardIndex + 1} dari {filteredStudents.length}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">
                      {currentCardStudent.namaSiswa}
                    </h3>
                    <p className="text-xs text-emerald-600 font-semibold">
                      Kelas {currentCardStudent.rombel} | NISN: {currentCardStudent.nisn || '-'}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={cardIndex >= filteredStudents.length - 1}
                    onClick={() => setCardIndex(prev => Math.min(filteredStudents.length - 1, prev + 1))}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Murid Selanjutnya <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Physical Measurement Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-bold text-slate-900 text-sm">Pengukuran Antropometri & Fisik</h4>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Satuan cm & kg</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Tinggi Badan */}
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                      <label className="text-xs font-bold text-emerald-900 block flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5 text-emerald-600" />
                        Tinggi Badan (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentCardStudent.tinggiBadan || ''}
                        onChange={e => handleFieldChange(currentCardStudent.id, 'tinggiBadan', e.target.value)}
                        placeholder="Contoh: 120"
                        className="w-full text-lg font-bold text-emerald-950 p-2 bg-white border border-emerald-300 rounded-lg text-center focus:outline-emerald-600"
                      />
                    </div>

                    {/* Berat Badan */}
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                      <label className="text-xs font-bold text-emerald-900 block flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-emerald-600" />
                        Berat Badan (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentCardStudent.beratBadan || ''}
                        onChange={e => handleFieldChange(currentCardStudent.id, 'beratBadan', e.target.value)}
                        placeholder="Contoh: 24.5"
                        className="w-full text-lg font-bold text-emerald-950 p-2 bg-white border border-emerald-300 rounded-lg text-center focus:outline-emerald-600"
                      />
                    </div>

                    {/* Lingkar Kepala */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <label className="text-xs font-bold text-slate-800 block flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-slate-600" />
                        Lingkar Kepala (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentCardStudent.lingkarKepala || ''}
                        onChange={e => handleFieldChange(currentCardStudent.id, 'lingkarKepala', e.target.value)}
                        placeholder="Contoh: 51"
                        className="w-full text-lg font-bold text-slate-900 p-2 bg-white border border-slate-300 rounded-lg text-center focus:outline-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Periodic & Transport Data */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs">Data Periodik & Rumah Tangga</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Jarak Rumah Ke Sekolah (KM)</label>
                        <input
                          type="text"
                          value={currentCardStudent.jarakSekolahKM || ''}
                          onChange={e => handleFieldChange(currentCardStudent.id, 'jarakSekolahKM', e.target.value)}
                          placeholder="Contoh: 1 km"
                          className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Alat Transportasi Utamanya</label>
                        <input
                          type="text"
                          value={currentCardStudent.transportasi || ''}
                          onChange={e => handleFieldChange(currentCardStudent.id, 'transportasi', e.target.value)}
                          placeholder="Contoh: Jalan kaki / Sepeda motor"
                          className="w-full p-2 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Jenis Tempat Tinggal</label>
                        <input
                          type="text"
                          value={currentCardStudent.jenisTinggal || ''}
                          onChange={e => handleFieldChange(currentCardStudent.id, 'jenisTinggal', e.target.value)}
                          placeholder="Contoh: Bersama orang tua"
                          className="w-full p-2 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Jml Saudara</label>
                          <input
                            type="number"
                            value={currentCardStudent.jmlSaudara || ''}
                            onChange={e => handleFieldChange(currentCardStudent.id, 'jmlSaudara', e.target.value)}
                            placeholder="0"
                            className="w-full p-2 border border-slate-300 rounded-lg text-center font-bold"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Anak Ke-</label>
                          <input
                            type="number"
                            value={currentCardStudent.anakKe || ''}
                            onChange={e => handleFieldChange(currentCardStudent.id, 'anakKe', e.target.value)}
                            placeholder="1"
                            className="w-full p-2 border border-slate-300 rounded-lg text-center font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Total Murid Ditampilkan: <strong>{filteredStudents.length} Murid</strong>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Semua Perubahan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
