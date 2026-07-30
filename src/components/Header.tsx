import React from 'react';
import { 
  GraduationCap, 
  PlusCircle, 
  FileUp, 
  Settings, 
  School,
  Database,
  FileText,
  CloudCheck
} from 'lucide-react';
import { SchoolInfo } from '../types';

interface HeaderProps {
  schoolInfo: SchoolInfo;
  totalStudents: number;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenDocsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  schoolInfo,
  totalStudents,
  onOpenAddModal,
  onOpenImportModal,
  onOpenSettingsModal,
  onOpenDocsModal,
}) => {
  return (
    <header id="main-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 gap-4">
          {/* App Branding & School Title */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-700 flex items-center justify-center shadow-lg shadow-emerald-500/10 overflow-hidden shrink-0">
                {schoolInfo.logoSekolah ? (
                  <img
                    src={schoolInfo.logoSekolah}
                    alt="Logo Sekolah"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex flex-col items-center justify-center p-0.5 text-slate-950 font-black">
                    <School className="w-5 h-5 text-slate-950" />
                    <span className="text-[7px] font-extrabold tracking-tighter leading-none uppercase mt-0.5">SD LOGO</span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    SIPA Dapodik
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CloudCheck className="w-3 h-3 text-emerald-400" />
                      Firebase Cloud Sync
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-200">{schoolInfo.name}</span>
                  <span className="hidden sm:inline">• NPSN: {schoolInfo.npsn}</span>
                </p>
              </div>
            </div>

            {/* Mobile Badge */}
            <div className="md:hidden flex items-center gap-2 text-xs bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-emerald-400">{totalStudents}</span> Murid
            </div>
          </div>

          {/* Academic Info Badge & Quick Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 w-full md:w-auto">
            {/* Academic Year Info Badge */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400">TA:</span>
              <span className="font-medium text-emerald-300">{schoolInfo.tahunAjaran}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Smt:</span>
              <span className="font-medium text-slate-200">{schoolInfo.semester}</span>
            </div>

            {/* Quick Action Buttons */}
            <button
              id="btn-admin-docs"
              onClick={onOpenDocsModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all border border-emerald-400/30 active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-200" />
              <span>Surat & Dokumen Hub</span>
            </button>

            <button
              id="btn-import-export"
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all border border-slate-700 active:scale-95 cursor-pointer"
            >
              <FileUp className="w-4 h-4 text-sky-400" />
              <span>Import / Export</span>
            </button>

            <button
              id="btn-add-student-header"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Murid Baru</span>
            </button>

            <button
              id="btn-school-settings"
              onClick={onOpenSettingsModal}
              title="Pengaturan Profil Sekolah"
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

