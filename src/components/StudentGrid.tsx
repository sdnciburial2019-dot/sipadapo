import React from 'react';
import { 
  Eye, 
  Edit3, 
  CreditCard, 
  FileText, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  User
} from 'lucide-react';
import { Student } from '../types';
import { formatNisn } from '../utils/storage';

interface StudentGridProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onPrintCard: (student: Student) => void;
  onPrintFpd: (student: Student) => void;
}

export const StudentGrid: React.FC<StudentGridProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
  onPrintCard,
  onPrintFpd,
}) => {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        Data murid tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {students.map(student => {
        const isPip = student.layakPip === 'Ya' || student.penerimaKip === 'Ya';

        return (
          <div 
            key={student.id} 
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Top Row: Rombel & PIP Tag */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-emerald-400 border border-slate-800">
                  Rombel {student.rombel}
                </span>

                {isPip ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Award className="w-3 h-3 text-emerald-600" />
                    Penerima PIP
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">
                    NISN: {formatNisn(student.nisn) || '-'}
                  </span>
                )}
              </div>

              {/* Avatar & Name */}
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg shrink-0 overflow-hidden shadow-2xs">
                  {student.fotoUrl ? (
                    <img src={student.fotoUrl} alt={student.namaSiswa} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-500">
                      {student.namaSiswa.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 
                    onClick={() => onSelectStudent(student)}
                    className="font-bold text-slate-900 text-sm truncate hover:text-emerald-600 cursor-pointer transition-colors"
                    title={student.namaSiswa}
                  >
                    {student.namaSiswa}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-mono">
                    <span>NIPD: {student.nipd || '-'}</span>
                    <span>•</span>
                    <span className={student.jk === 'Laki-laki' ? 'text-blue-600' : 'text-pink-600'}>
                      {student.jk === 'Laki-laki' ? 'L' : 'P'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Details */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-2 text-slate-600 truncate">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Ortu: {student.namaAyah || student.namaIbu || '-'}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-700">{student.hp || '-'}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 truncate text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{student.alamat || '-'}</span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => onSelectStudent(student)}
                className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Detail
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onPrintCard(student)}
                  title="Cetak Kartu Murid"
                  className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onPrintFpd(student)}
                  title="Cetak Form Biodata"
                  className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onEditStudent(student)}
                  title="Edit Data"
                  className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

