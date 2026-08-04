import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  Eye, 
  CreditCard, 
  Users, 
  Award, 
  CheckCircle2,
  Briefcase,
  Phone,
  Mail,
  MoreVertical
} from 'lucide-react';
import { Teacher, SchoolInfo } from '../types';
import { exportTeachersToExcel, saveTeachers } from '../utils/storage';
import { deleteTeacherFromFirestore, deleteBulkTeachersFromFirestore } from '../lib/firebase';
import { TeacherFormModal } from './TeacherFormModal';
import { TeacherDetailModal } from './TeacherDetailModal';
import { TeacherCardPrintModal } from './TeacherCardPrintModal';
import { TeacherImportModal } from './TeacherImportModal';

interface TeacherTableProps {
  teachers: Teacher[];
  schoolInfo: SchoolInfo;
  onTeachersUpdated: (updated: Teacher[]) => void;
}

export const TeacherTable: React.FC<TeacherTableProps> = ({
  teachers,
  schoolInfo,
  onTeachersUpdated
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterJenisPtk, setFilterJenisPtk] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTeacherForDetail, setSelectedTeacherForDetail] = useState<Teacher | null>(null);

  const [isCardPrintOpen, setIsCardPrintOpen] = useState(false);
  const [selectedTeacherForCard, setSelectedTeacherForCard] = useState<Teacher | null>(null);

  const [isImportOpen, setIsImportOpen] = useState(false);

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        !q ||
        t.nama.toLowerCase().includes(q) ||
        (t.nuptk && t.nuptk.includes(q)) ||
        (t.nip && t.nip.includes(q)) ||
        (t.nik && t.nik.includes(q)) ||
        (t.hp && t.hp.includes(q)) ||
        (t.mapelDiampu && t.mapelDiampu.toLowerCase().includes(q)) ||
        (t.rombelMengajar && t.rombelMengajar.toLowerCase().includes(q)) ||
        (t.tugasTambahan && t.tugasTambahan.toLowerCase().includes(q));

      const matchStatus = filterStatus === 'all' || t.statusKepegawaian === filterStatus;
      const matchJenis = filterJenisPtk === 'all' || t.jenisPtk === filterJenisPtk;

      return matchSearch && matchStatus && matchJenis;
    });
  }, [teachers, searchQuery, filterStatus, filterJenisPtk]);

  // Statistics
  const stats = useMemo(() => {
    const total = teachers.length;
    const pnsPppk = teachers.filter(t => t.statusKepegawaian === 'PNS' || t.statusKepegawaian === 'PPPK').length;
    const honor = teachers.filter(t => t.statusKepegawaian !== 'PNS' && t.statusKepegawaian !== 'PPPK').length;
    const laki = teachers.filter(t => t.jk === 'L' || t.jk === 'Laki-laki').length;
    const perempuan = teachers.filter(t => t.jk === 'P' || t.jk === 'Perempuan').length;

    return { total, pnsPppk, honor, laki, perempuan };
  }, [teachers]);

  // Select all checkboxes logic
  const isAllSelected = filteredTeachers.length > 0 && selectedIds.length === filteredTeachers.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTeachers.map(t => t.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // CRUD Handlers
  const handleSaveTeacher = (teacher: Teacher) => {
    const exists = teachers.some(t => t.id === teacher.id);
    let updated: Teacher[] = [];
    if (exists) {
      updated = teachers.map(t => (t.id === teacher.id ? teacher : t));
    } else {
      updated = [teacher, ...teachers];
    }
    saveTeachers(updated);
    onTeachersUpdated(updated);
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data Guru/PTK "${teacher.nama}"?`)) {
      const updated = teachers.filter(t => t.id !== teacher.id);
      saveTeachers(updated);
      onTeachersUpdated(updated);
      deleteTeacherFromFirestore(teacher.id).catch(err => {
        console.warn('Error deleting teacher from Firestore:', err);
      });
    }
  };

  const handleDeleteBulk = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data Guru/PTK yang dipilih?`)) {
      const updated = teachers.filter(t => !selectedIds.includes(t.id));
      saveTeachers(updated);
      onTeachersUpdated(updated);
      deleteBulkTeachersFromFirestore(selectedIds).catch(err => {
        console.warn('Error bulk deleting teachers from Firestore:', err);
      });
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Guru & PTK</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.total} <span className="text-xs font-semibold text-slate-500">Orang</span></h3>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PNS & PPPK</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">{stats.pnsPppk} <span className="text-xs font-semibold text-slate-500">Orang</span></h3>
          </div>
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Honor / GTT / PTT</p>
            <h3 className="text-2xl font-black text-amber-700 mt-0.5">{stats.honor} <span className="text-xs font-semibold text-slate-500">Orang</span></h3>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Laki-Laki / Perempuan</p>
            <h3 className="text-xl font-black text-slate-800 mt-0.5">{stats.laki} L <span className="text-slate-400 font-normal">/</span> {stats.perempuan} P</h3>
          </div>
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* FILTER & TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama guru, NUPTK, NIP, NIK, No. HP..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Status Kepegawaian</option>
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option value="GTT/GTY">GTT/GTY</option>
                <option value="Honor Daerah">Honor Daerah</option>
                <option value="PTT">PTT</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-xl text-xs">
              <select
                value={filterJenisPtk}
                onChange={e => setFilterJenisPtk(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Jenis PTK</option>
                <option value="Guru Kelas">Guru Kelas</option>
                <option value="Guru Mapel">Guru Mapel</option>
                <option value="Guru BK">Guru BK</option>
                <option value="Kepala Sekolah">Kepala Sekolah</option>
                <option value="Tenaga Administrasi">Tenaga Administrasi</option>
                <option value="Penjaga Sekolah">Penjaga Sekolah</option>
              </select>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTeacherToEdit(null);
                setIsAddEditOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Tambah Guru & PTK Baru
            </button>

            <button
              onClick={() => setIsImportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition cursor-pointer border border-slate-200"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              Import Excel
            </button>

            <button
              onClick={() => exportTeachersToExcel(teachers)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition cursor-pointer border border-slate-200"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              Export Excel
            </button>
          </div>

          {/* BULK ACTIONS */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">{selectedIds.length} terpilih</span>
              <button
                onClick={handleDeleteBulk}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Terpilih
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TEACHERS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Nama Guru / PTK</th>
                <th className="py-3 px-4">NUPTK / NIP</th>
                <th className="py-3 px-4">JK</th>
                <th className="py-3 px-4">Status & Jenis PTK</th>
                <th className="py-3 px-4">Tugas Mengajar & Tambahan</th>
                <th className="py-3 px-4">Kontak (HP/Email)</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Users className="w-12 h-12 stroke-1 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-sm">Belum ada data Guru & PTK</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Klik <span className="font-semibold text-emerald-700">"Tambah Guru & PTK Baru"</span> atau import dari file Excel Dapodik Anda.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((t, idx) => {
                  const isSelected = selectedIds.includes(t.id);
                  return (
                    <tr 
                      key={t.id} 
                      className={`hover:bg-slate-50/80 transition ${isSelected ? 'bg-emerald-50/40' : ''}`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(t.id)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-400">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 font-bold text-xs">
                            {t.fotoUrl ? (
                              <img src={t.fotoUrl} alt={t.nama} className="w-full h-full object-cover" />
                            ) : (
                              t.nama.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block hover:text-emerald-700 cursor-pointer" onClick={() => { setSelectedTeacherForDetail(t); setIsDetailOpen(true); }}>
                              {t.nama}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              NIK: {t.nik || '-'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div>
                          <span className="block font-semibold text-slate-800">NUPTK: {t.nuptk || '-'}</span>
                          <span className="block text-[10px] text-slate-500">NIP: {t.nip || '-'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.jk === 'L' || t.jk === 'Laki-laki'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-pink-50 text-pink-700'
                        }`}>
                          {t.jk === 'L' || t.jk === 'Laki-laki' ? 'L' : 'P'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                            {t.statusKepegawaian || 'PNS'}
                          </span>
                          <span className="block text-slate-600 text-[11px] font-medium">
                            {t.jenisPtk || 'Guru Kelas'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs font-medium text-slate-700">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200/60 rounded text-[10.5px] font-bold">
                              {t.mapelDiampu || t.jenisPtk || 'Guru Kelas'}
                            </span>
                            {t.rombelMengajar && (
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                                {t.rombelMengajar}
                              </span>
                            )}
                            {t.jumlahJamMengajar && (
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                                {t.jumlahJamMengajar} J/m
                              </span>
                            )}
                          </div>
                          {t.tugasTambahan && (
                            <div className="text-[10.5px] text-amber-800 font-medium flex items-center gap-1">
                              <span className="text-[9px] bg-amber-100 px-1 rounded uppercase font-bold text-amber-900">Tambahan</span>
                              <span>{t.tugasTambahan}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <div className="space-y-0.5 text-[11px]">
                          {t.hp && <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-600" /> {t.hp}</div>}
                          {t.email && <div className="flex items-center gap-1 text-[10px] text-slate-500"><Mail className="w-3 h-3 text-slate-400" /> {t.email}</div>}
                          {!t.hp && !t.email && <span className="text-slate-400">-</span>}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            title="Lihat Profil Lengkap"
                            onClick={() => {
                              setSelectedTeacherForDetail(t);
                              setIsDetailOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            title="Cetak Kartu PTK Digital"
                            onClick={() => {
                              setSelectedTeacherForCard(t);
                              setIsCardPrintOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition cursor-pointer"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>

                          <button
                            title="Edit Data Guru"
                            onClick={() => {
                              setTeacherToEdit(t);
                              setIsAddEditOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            title="Hapus Data"
                            onClick={() => handleDeleteTeacher(t)}
                            className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {/* MODALS */}
      <TeacherFormModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSaveTeacher}
        teacherToEdit={teacherToEdit}
      />

      <TeacherDetailModal
        teacher={selectedTeacherForDetail}
        schoolInfo={schoolInfo}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={(t) => {
          setIsDetailOpen(false);
          setTeacherToEdit(t);
          setIsAddEditOpen(true);
        }}
      />

      <TeacherCardPrintModal
        teacher={selectedTeacherForCard}
        schoolInfo={schoolInfo}
        isOpen={isCardPrintOpen}
        onClose={() => setIsCardPrintOpen(false)}
      />

      <TeacherImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onTeachersImported={(imported) => onTeachersUpdated(imported)}
        existingTeachers={teachers}
      />

    </div>
  );
};
