import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, 
  List, 
  PlusCircle, 
  FileUp, 
  GraduationCap, 
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Student, SchoolInfo, FilterOptions } from './types';
import { 
  getStoredStudents, 
  saveStudents, 
  getStoredSchoolInfo, 
  exportToExcel, 
  calculateStudentCompleteness 
} from './utils/storage';
import { 
  subscribeStudents, 
  subscribeSchoolInfo, 
  saveStudentToFirestore, 
  saveAllStudentsToFirestore, 
  deleteStudentFromFirestore, 
  deleteBulkStudentsFromFirestore,
  saveSchoolInfoToFirestore 
} from './lib/firebase';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { StudentTable } from './components/StudentTable';
import { StudentGrid } from './components/StudentGrid';
import { StudentDetailModal } from './components/StudentDetailModal';
import { StudentFormModal } from './components/StudentFormModal';
import { StudentCardPrintModal } from './components/StudentCardPrintModal';
import { DapodikFormPrintModal } from './components/DapodikFormPrintModal';
import { ImportExportModal } from './components/ImportExportModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { AdminDocumentsModal, DocType } from './components/AdminDocumentsModal';

export default function App() {
  const [students, setStudents] = useState<Student[]>(getStoredStudents());
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(getStoredSchoolInfo());
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter State
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    rombel: '',
    jk: '',
    pipStatus: '',
    agama: '',
    dataCompleteness: 'all',
  });

  // Selected Student Checkboxes for Bulk Action
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Active Modals
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [formStudent, setFormStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [cardPrintStudents, setCardPrintStudents] = useState<Student[]>([]);
  const [isCardPrintOpen, setIsCardPrintOpen] = useState(false);

  const [fpdStudent, setFpdStudent] = useState<Student | null>(null);
  const [isFpdOpen, setIsFpdOpen] = useState(false);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Administrative Documents Hub State
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [docsTypeTarget, setDocsTypeTarget] = useState<DocType>('absensi');
  const [docsStudentTarget, setDocsStudentTarget] = useState<Student | null>(null);

  const handleOpenDocsModal = (docType: DocType = 'absensi', student: Student | null = null) => {
    setDocsTypeTarget(docType);
    setDocsStudentTarget(student);
    setIsDocsOpen(true);
  };

  // Notification Banner
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Load & Realtime Sync Data from Firestore
  useEffect(() => {
    const unsubscribeStudents = subscribeStudents(
      (firestoreStudents) => {
        setStudents(firestoreStudents);
        // Local storage cache
        try {
          localStorage.setItem('sipa_dapodik_students_v1', JSON.stringify(firestoreStudents));
        } catch (e) {
          console.warn('Localstorage cache error:', e);
        }
      },
      (err) => console.error('Students sync error:', err)
    );

    const unsubscribeSchool = subscribeSchoolInfo(
      (info) => {
        setSchoolInfo(info);
        try {
          localStorage.setItem('sipa_dapodik_school_v1', JSON.stringify(info));
        } catch (e) {
          console.warn('Localstorage school info cache error:', e);
        }
      },
      (err) => console.error('School info sync error:', err)
    );

    return () => {
      unsubscribeStudents();
      unsubscribeSchool();
    };
  }, []);

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      // Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchName = s.namaSiswa.toLowerCase().includes(query);
        const matchNisn = (s.nisn || '').toLowerCase().includes(query);
        const matchNipd = (s.nipd || '').toLowerCase().includes(query);
        const matchNik = (s.nik || '').toLowerCase().includes(query);
        const matchOrtu = (s.namaAyah || '').toLowerCase().includes(query) || (s.namaIbu || '').toLowerCase().includes(query);
        if (!matchName && !matchNisn && !matchNipd && !matchNik && !matchOrtu) return false;
      }

      // Rombel
      if (filters.rombel && s.rombel !== filters.rombel) return false;

      // JK
      if (filters.jk && s.jk !== filters.jk) return false;

      // PIP Status
      if (filters.pipStatus === 'Ya') {
        const isPip = s.layakPip === 'Ya' || s.penerimaKip === 'Ya';
        if (!isPip) return false;
      } else if (filters.pipStatus === 'Tidak') {
        const isPip = s.layakPip === 'Ya' || s.penerimaKip === 'Ya';
        if (isPip) return false;
      }

      // Data completeness
      if (filters.dataCompleteness === 'incomplete') {
        const { percentage } = calculateStudentCompleteness(s);
        if (percentage >= 85) return false;
      }

      return true;
    });
  }, [students, filters]);

  // Bulk Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Save / Update Student
  const handleSaveStudent = async (studentData: Student) => {
    const exists = students.some(s => s.id === studentData.id);
    if (exists) {
      showToast(`Data murid ${studentData.namaSiswa} berhasil diperbarui.`);
    } else {
      showToast(`Murid baru ${studentData.namaSiswa} berhasil ditambahkan.`);
    }

    try {
      await saveStudentToFirestore(studentData);
    } catch (err) {
      console.error('Error saving student to Firestore:', err);
      showToast('Gagal menyimpan ke cloud, menyimpan secara lokal.');
      const updated = exists 
        ? students.map(s => s.id === studentData.id ? studentData : s) 
        : [studentData, ...students];
      setStudents(updated);
      saveStudents(updated);
    }

    setIsFormOpen(false);
    setFormStudent(null);
  };

  // Delete Single Student
  const handleDeleteStudent = async (student: Student) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data murid "${student.namaSiswa}"?`)) {
      try {
        await deleteStudentFromFirestore(student.id);
        showToast(`Data murid ${student.namaSiswa} telah dihapus.`);
      } catch (err) {
        console.error('Error deleting student from Firestore:', err);
        const updated = students.filter(s => s.id !== student.id);
        setStudents(updated);
        saveStudents(updated);
        showToast(`Data murid ${student.namaSiswa} telah dihapus secara lokal.`);
      }
      setDetailStudent(null);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data murid terpilih?`)) {
      try {
        await deleteBulkStudentsFromFirestore(selectedIds);
        showToast(`${selectedIds.length} data murid berhasil dihapus.`);
      } catch (err) {
        console.error('Error bulk deleting from Firestore:', err);
        const updated = students.filter(s => !selectedIds.includes(s.id));
        setStudents(updated);
        saveStudents(updated);
      }
      setSelectedIds([]);
    }
  };

  // Bulk Change Class (Rombel)
  const handleBulkChangeRombel = async (targetRombel: string) => {
    const updated = students.map(s => {
      if (selectedIds.includes(s.id)) {
        return { ...s, rombel: targetRombel };
      }
      return s;
    });

    try {
      const changedStudents = updated.filter(s => selectedIds.includes(s.id));
      await saveAllStudentsToFirestore(changedStudents);
      showToast(`${selectedIds.length} murid berhasil dipindahkan ke Rombel ${targetRombel}.`);
    } catch (err) {
      console.error('Error updating rombel in Firestore:', err);
      setStudents(updated);
      saveStudents(updated);
    }
    setSelectedIds([]);
  };

  // Bulk Print Cards
  const handleBulkPrintCards = () => {
    const selectedStudents = students.filter(s => selectedIds.includes(s.id));
    if (selectedStudents.length > 0) {
      setCardPrintStudents(selectedStudents);
      setIsCardPrintOpen(true);
    }
  };

  // Bulk Export Excel
  const handleBulkExport = () => {
    const selectedStudents = students.filter(s => selectedIds.includes(s.id));
    exportToExcel(selectedStudents, `dapodik_murid_terpilih_${Date.now()}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans antialiased">
      {/* App Main UI Container (Hidden during Document Modal Printing) */}
      <div className={isDocsOpen ? 'no-print' : ''}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        schoolInfo={schoolInfo}
        totalStudents={students.length}
        onOpenAddModal={() => {
          setFormStudent(null);
          setIsFormOpen(true);
        }}
        onOpenImportModal={() => setIsImportOpen(true)}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        onOpenDocsModal={() => handleOpenDocsModal('absensi')}
      />

      {/* Main Dashboard Stats & Recharts Visualizations */}
      <DashboardStats
        students={students}
        onSelectRombelFilter={r => setFilters(prev => ({ ...prev, rombel: r, dataCompleteness: 'all', pipStatus: '' }))}
        onSelectPipFilter={p => setFilters(prev => ({ ...prev, pipStatus: prev.pipStatus === 'Ya' ? '' : 'Ya', dataCompleteness: 'all' }))}
        onSelectIncompleteFilter={() => setFilters(prev => ({ ...prev, dataCompleteness: prev.dataCompleteness === 'incomplete' ? 'all' : 'incomplete' }))}
        selectedCompletenessFilter={filters.dataCompleteness}
      />

      {/* Main Application Directory Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* View Toggle Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Daftar Murid (Dapodik)
              <span className="text-xs font-normal text-slate-500 font-mono">
                ({filteredStudents.length} murid)
              </span>
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="bg-slate-200 p-0.5 rounded-lg flex items-center gap-0.5 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Tabel</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kartu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Directory View (Table or Grid) */}
        {viewMode === 'table' ? (
          <StudentTable
            students={filteredStudents}
            filters={filters}
            onFilterChange={setFilters}
            onSelectStudent={s => setDetailStudent(s)}
            onEditStudent={s => {
              setFormStudent(s);
              setIsFormOpen(true);
            }}
            onDeleteStudent={handleDeleteStudent}
            onPrintCard={s => {
              setCardPrintStudents([s]);
              setIsCardPrintOpen(true);
            }}
            onPrintFpd={s => {
              setFpdStudent(s);
              setIsFpdOpen(true);
            }}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectOne={handleToggleSelectOne}
            onBulkDelete={handleBulkDelete}
            onBulkPrintCards={handleBulkPrintCards}
            onBulkExport={handleBulkExport}
            onBulkChangeRombel={handleBulkChangeRombel}
          />
        ) : (
          <StudentGrid
            students={filteredStudents}
            onSelectStudent={s => setDetailStudent(s)}
            onEditStudent={s => {
              setFormStudent(s);
              setIsFormOpen(true);
            }}
            onPrintCard={s => {
              setCardPrintStudents([s]);
              setIsCardPrintOpen(true);
            }}
            onPrintFpd={s => {
              setFpdStudent(s);
              setIsFpdOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">{schoolInfo.name}</span>
            <span>• Sistem Administrasi Data Pokok Pendidikan (Dapodik)</span>
          </div>

          <div className="text-slate-500">
            Tahun Ajaran {schoolInfo.tahunAjaran} ({schoolInfo.semester})
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Detail Student Profile Modal */}
      {detailStudent && (
        <StudentDetailModal
          student={detailStudent}
          onClose={() => setDetailStudent(null)}
          onEdit={s => {
            setDetailStudent(null);
            setFormStudent(s);
            setIsFormOpen(true);
          }}
          onDelete={s => handleDeleteStudent(s)}
          onPrintCard={s => {
            setCardPrintStudents([s]);
            setIsCardPrintOpen(true);
          }}
          onPrintFpd={s => {
            setFpdStudent(s);
            setIsFpdOpen(true);
          }}
          onOpenDocsModal={(type, s) => {
            handleOpenDocsModal((type as DocType) || 'aktif', s || detailStudent);
          }}
        />
      )}

      {/* 2. Form Add/Edit Student Modal */}
      {isFormOpen && (
        <StudentFormModal
          student={formStudent}
          onClose={() => {
            setIsFormOpen(false);
            setFormStudent(null);
          }}
          onSave={handleSaveStudent}
        />
      )}

      {/* 3. Card Print Modal */}
      {isCardPrintOpen && cardPrintStudents.length > 0 && (
        <StudentCardPrintModal
          students={cardPrintStudents}
          schoolInfo={schoolInfo}
          onClose={() => {
            setIsCardPrintOpen(false);
            setCardPrintStudents([]);
          }}
        />
      )}

      {/* 4. F-PD Form Print Modal */}
      {isFpdOpen && fpdStudent && (
        <DapodikFormPrintModal
          student={fpdStudent}
          schoolInfo={schoolInfo}
          onClose={() => {
            setIsFpdOpen(false);
            setFpdStudent(null);
          }}
        />
      )}

      {/* 5. Import / Export Modal */}
      {isImportOpen && (
        <ImportExportModal
          students={students}
          onStudentsUpdated={newStudents => {
            setStudents(newStudents);
            showToast('Database murid berhasil diperbarui!');
          }}
          onClose={() => setIsImportOpen(false)}
        />
      )}

      {/* 6. School Settings Modal */}
      {isSettingsOpen && (
        <SchoolSettingsModal
          schoolInfo={schoolInfo}
          onSave={updatedInfo => {
            setSchoolInfo(updatedInfo);
            showToast('Profil sekolah berhasil disimpan.');
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      </div>

      {/* 7. Administrative Documents & Letters Center Modal */}
      {isDocsOpen && (
        <AdminDocumentsModal
          students={students}
          schoolInfo={schoolInfo}
          initialDocType={docsTypeTarget}
          initialStudent={docsStudentTarget}
          onClose={() => {
            setIsDocsOpen(false);
            setDocsStudentTarget(null);
          }}
        />
      )}
    </div>
  );
}

