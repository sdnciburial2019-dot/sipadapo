import React from 'react';
import { 
  GraduationCap, 
  PlusCircle, 
  FileUp, 
  Settings, 
  School,
  Database,
  FileText,
  CloudCheck,
  Activity
} from 'lucide-react';
import { SchoolInfo } from '../types';

interface HeaderProps {
  schoolInfo: SchoolInfo;
  totalStudents: number;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenDocsModal: () => void;
  onOpenPhysicalDataModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  schoolInfo,
  totalStudents,
  onOpenAddModal,
  onOpenImportModal,
  onOpenSettingsModal,
  onOpenDocsModal,
  onOpenPhysicalDataModal,
}) => {
  return (
    <header id="main-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-2.5 sm:py-3 gap-3">
          {/* App Branding & School Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-700 flex items-center justify-center shadow-lg shadow-emerald-500/10 overflow-hidden shrink-0">
                {schoolInfo.logoSekolah ? (
                  <img
                    src={schoolInfo.logoSekolah}
                    alt="Logo Sekolah"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex flex-col items-center justify-center p-0.5 text-slate-950 font-black">
                    <School className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                    <span className="text-[6px] sm:text-[7px] font-extrabold tracking-tighter leading-none uppercase mt-0.5">SD LOGO</span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
                    SIPA Dapodik
                  </h1>
                  <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                    <CloudCheck className="w-3 h-3 text-emerald-400" />
                    <span className="hidden xs:inline">Firebase Cloud</span>
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                  <School className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-200 truncate">{schoolInfo.name}</span>
                  <span className="hidden sm:inline shrink-0">• NPSN: {schoolInfo.npsn}</span>
                </p>
              </div>
            </div>

            {/* Mobile Badge */}
            <div className="md:hidden flex items-center gap-1.5 text-[11px] sm:text-xs bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 shrink-0">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-emerald-400">{totalStudents}</span> Murid
            </div>
          </div>

          {/* Academic Info Badge & Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 w-full md:w-auto overflow-x-auto pb-0.5 md:pb-0 scrollbar-none justify-start md:justify-end">
            {/* Academic Year Info Badge */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs shrink-0">
              <span className="text-slate-400">TA:</span>
              <span className="font-medium text-emerald-300">{schoolInfo.tahunAjaran}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Smt:</span>
              <span className="font-medium text-slate-200">{schoolInfo.semester}</span>
            </div>

            {/* Quick Action Buttons */}
            <button
              id="btn-physical-data"
              onClick={onOpenPhysicalDataModal}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-600/90 hover:bg-amber-500 text-white text-[11px] sm:text-xs font-semibold rounded-lg shadow-sm transition-all border border-amber-400/40 active:scale-95 cursor-pointer shrink-0"
              title="Form Update Masal Data Fisik (TB/BB) & Periodik Murid"
            >
              <Activity className="w-3.5 h-3.5 text-amber-200" />
              <span>Data Fisik</span>
            </button>

            <button
              id="btn-admin-docs"
              onClick={onOpenDocsModal}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] sm:text-xs font-semibold rounded-lg shadow-sm transition-all border border-emerald-400/30 active:scale-95 cursor-pointer shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-200" />
              <span>Dokumen Hub</span>
            </button>

            <button
              id="btn-import-export"
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] sm:text-xs font-medium rounded-lg transition-all border border-slate-700 active:scale-95 cursor-pointer shrink-0"
            >
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>Database</span>
            </button>

            <button
              id="btn-add-student-header"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-semibold rounded-lg shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Murid</span>
            </button>

            <button
              id="btn-school-settings"
              onClick={onOpenSettingsModal}
              title="Pengaturan Profil Sekolah"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer shrink-0"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

