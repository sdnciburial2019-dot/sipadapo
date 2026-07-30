import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  CreditCard, 
  FileText, 
  SlidersHorizontal, 
  CheckSquare, 
  Square, 
  Download, 
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { Student, FilterOptions } from '../types';
import { ROMBEL_LIST } from '../data/dapodikOptions';
import { calculateStudentCompleteness, formatNisn } from '../utils/storage';

interface StudentTableProps {
  students: Student[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onPrintCard: (student: Student) => void;
  onPrintFpd: (student: Student) => void;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onBulkDelete: () => void;
  onBulkPrintCards: () => void;
  onBulkExport: () => void;
  onBulkChangeRombel: (targetRombel: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  filters,
  onFilterChange,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  onPrintCard,
  onPrintFpd,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onBulkDelete,
  onBulkPrintCards,
  onBulkExport,
  onBulkChangeRombel,
}) => {
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [showBulkRombelModal, setShowBulkRombelModal] = useState(false);
  const [targetRombel, setTargetRombel] = useState('2 A');

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState({
    nipd: true,
    jk: true,
    nisn: true,
    nik: true,
    ttl: true,
    ortu: true,
    hp: true,
    pip: true,
    kelengkapan: true,
  });

  const isAllSelected = students.length > 0 && selectedIds.length === students.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Search & Filter Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={e => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Cari Nama Murid, NISN, NIPD, NIK, atau Nama Orang Tua..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
            />
          </div>

          {/* Filters & Column Toggle */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Rombel Filter */}
            <select
              value={filters.rombel}
              onChange={e => onFilterChange({ ...filters, rombel: e.target.value })}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs cursor-pointer"
            >
              <option value="">Semua Rombel</option>
              {ROMBEL_LIST.map(r => (
                <option key={r} value={r}>Kelas {r}</option>
              ))}
            </select>

            {/* Gender Filter */}
            <select
              value={filters.jk}
              onChange={e => onFilterChange({ ...filters, jk: e.target.value })}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs cursor-pointer"
            >
              <option value="">Semua Gender</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>

            {/* PIP Status Filter */}
            <select
              value={filters.pipStatus}
              onChange={e => onFilterChange({ ...filters, pipStatus: e.target.value })}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs cursor-pointer"
            >
              <option value="">Status PIP (Semua)</option>
              <option value="Ya">Penerima PIP/KIP</option>
              <option value="Tidak">Bukan Penerima</option>
            </select>

            {/* Kelengkapan Data Filter */}
            <select
              value={filters.dataCompleteness}
              onChange={e => onFilterChange({ ...filters, dataCompleteness: e.target.value as any })}
              className={`px-3 py-2 border rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs cursor-pointer ${
                filters.dataCompleteness === 'incomplete'
                  ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold'
                  : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <option value="all">Status Kelengkapan (Semua)</option>
              <option value="incomplete">⚠️ Data Belum Lengkap (&lt;85%)</option>
            </select>

            {/* Column Picker Button */}
            <div className="relative">
              <button
                onClick={() => setShowColumnPicker(!showColumnPicker)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Kolom</span>
              </button>

              {showColumnPicker && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 p-3 z-30 text-xs text-slate-700 space-y-2">
                  <p className="font-semibold text-slate-900 border-b pb-1">Tampilkan Kolom:</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.nipd}
                      onChange={e => setVisibleColumns({ ...visibleColumns, nipd: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>NIPD</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.nisn}
                      onChange={e => setVisibleColumns({ ...visibleColumns, nisn: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>NISN</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.nik}
                      onChange={e => setVisibleColumns({ ...visibleColumns, nik: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>NIK</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.ttl}
                      onChange={e => setVisibleColumns({ ...visibleColumns, ttl: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Tempat Tanggal Lahir</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.ortu}
                      onChange={e => setVisibleColumns({ ...visibleColumns, ortu: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Nama Orang Tua</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.hp}
                      onChange={e => setVisibleColumns({ ...visibleColumns, hp: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>No. HP Ortu</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.pip}
                      onChange={e => setVisibleColumns({ ...visibleColumns, pip: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Status PIP / KIP</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.kelengkapan}
                      onChange={e => setVisibleColumns({ ...visibleColumns, kelengkapan: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Skor Kelengkapan</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar (When items are selected) */}
        {selectedIds.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-900">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
                {selectedIds.length}
              </span>
              <span>Murid Dipilih</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <button
                onClick={onBulkPrintCards}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded font-medium shadow-2xs transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                Cetak Kartu Murid ({selectedIds.length})
              </button>

              <button
                onClick={onBulkExport}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded font-medium shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-sky-600" />
                Export Excel .xlsx ({selectedIds.length})
              </button>

              <button
                onClick={() => setShowBulkRombelModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded font-medium shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
                Naik / Pindah Kelas
              </button>

              <button
                onClick={onBulkDelete}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-300 hover:bg-rose-100 text-rose-700 rounded font-medium transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                Hapus Terpilih
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
              <th className="p-3 w-10 text-center">
                <button 
                  onClick={onToggleSelectAll} 
                  className="text-slate-500 hover:text-slate-800 cursor-pointer"
                  title="Pilih Semua Murid"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-3 w-12 text-center">No</th>
              <th className="p-3">Nama Murid</th>
              <th className="p-3">Rombel</th>
              {visibleColumns.nipd && <th className="p-3">NIPD</th>}
              {visibleColumns.jk && <th className="p-3">JK</th>}
              {visibleColumns.nisn && <th className="p-3">NISN</th>}
              {visibleColumns.nik && <th className="p-3">NIK</th>}
              {visibleColumns.ttl && <th className="p-3">Tempat, Tanggal Lahir</th>}
              {visibleColumns.ortu && <th className="p-3">Nama Ortu (Ayah/Ibu)</th>}
              {visibleColumns.hp && <th className="p-3">No. HP</th>}
              {visibleColumns.pip && <th className="p-3 text-center">Status PIP</th>}
              {visibleColumns.kelengkapan && <th className="p-3 text-center">Kelengkapan</th>}
              <th className="p-3 text-right sticky right-0 bg-slate-100/90 shadow-2xs">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={14} className="p-8 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-slate-700">Data murid tidak ditemukan</p>
                    <p className="text-xs">Coba sesuaikan kata kunci pencarian atau filter rombel/gender.</p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student, idx) => {
                const isSelected = selectedIds.includes(student.id);
                const { percentage } = calculateStudentCompleteness(student);
                const isPip = student.layakPip === 'Ya' || student.penerimaKip === 'Ya';

                return (
                  <tr 
                    key={student.id} 
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-emerald-50/60' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => onToggleSelectOne(student.id)} 
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    <td className="p-3 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => onSelectStudent(student)}
                        className="font-bold text-slate-900 hover:text-emerald-700 text-left block transition-colors cursor-pointer"
                      >
                        {student.namaSiswa}
                      </button>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {student.email || 'Email belum ada'}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                        {student.rombel}
                      </span>
                    </td>

                    {visibleColumns.nipd && (
                      <td className="p-3 font-mono text-slate-600">{student.nipd || '-'}</td>
                    )}

                    {visibleColumns.jk && (
                      <td className="p-3">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          student.jk === 'Laki-laki' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-pink-100 text-pink-700'
                        }`}>
                          {student.jk === 'Laki-laki' ? 'L' : 'P'}
                        </span>
                      </td>
                    )}

                    {visibleColumns.nisn && (
                      <td className="p-3 font-mono font-semibold text-slate-800">{formatNisn(student.nisn) || '-'}</td>
                    )}

                    {visibleColumns.nik && (
                      <td className="p-3 font-mono text-slate-500">{student.nik || '-'}</td>
                    )}

                    {visibleColumns.ttl && (
                      <td className="p-3 text-slate-700 max-w-[150px] truncate" title={student.ttl}>
                        {student.ttl || '-'}
                      </td>
                    )}

                    {visibleColumns.ortu && (
                      <td className="p-3 text-slate-700 max-w-[150px] truncate" title={`Ayah: ${student.namaAyah} / Ibu: ${student.namaIbu}`}>
                        {student.namaAyah || student.namaIbu || '-'}
                      </td>
                    )}

                    {visibleColumns.hp && (
                      <td className="p-3 font-mono text-slate-600">{student.hp || '-'}</td>
                    )}

                    {visibleColumns.pip && (
                      <td className="p-3 text-center">
                        {isPip ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            PIP
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">-</span>
                        )}
                      </td>
                    )}

                    {visibleColumns.kelengkapan && (
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                          percentage >= 85 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : percentage >= 65 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {percentage}%
                        </span>
                      </td>
                    )}

                    <td className="p-3 text-right sticky right-0 bg-white shadow-2xs">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onSelectStudent(student)}
                          title="Lihat Detail Profil"
                          className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onEditStudent(student)}
                          title="Edit Data Murid"
                          className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onPrintCard(student)}
                          title="Cetak Kartu Murid"
                          className="p-1 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onPrintFpd(student)}
                          title="Cetak Form Biodata F-PD Dapodik"
                          className="p-1 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteStudent(student)}
                          title="Hapus Data"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info & Counter */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div>
          Menampilkan <span className="font-semibold text-slate-800">{students.length}</span> murid
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>* Klik nama murid untuk melihat biodata lengkap</span>
        </div>
      </div>

      {/* Modal Bulk Rombel / Promotion */}
      {showBulkRombelModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-emerald-600" />
              Pindah / Naik Rombel Massal
            </h3>
            <p className="text-xs text-slate-600">
              Pindahkan <span className="font-bold text-emerald-700">{selectedIds.length} murid</span> yang dipilih ke Rombel (Kelas) tujuan baru:
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Rombel Tujuan / Status Baru:</label>
              <select
                value={targetRombel}
                onChange={e => setTargetRombel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <optgroup label="--- Rombel (Kelas) ---">
                  {ROMBEL_LIST.map(r => (
                    <option key={r} value={r}>Kelas {r}</option>
                  ))}
                </optgroup>
                <optgroup label="--- Kelulusan & Kepindahan ---">
                  <option value="Alumni">🎓 Lulus (Pindah ke Tab Alumni)</option>
                  <option value="Mutasi Keluar">📤 Mutasi Keluar (Pindah ke Tab Murid Mutasi)</option>
                </optgroup>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowBulkRombelModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onBulkChangeRombel(targetRombel);
                  setShowBulkRombelModal(false);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

