import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Award, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Filter
} from 'lucide-react';
import { Student } from '../types';
import { calculateStudentCompleteness } from '../utils/storage';
import { ROMBEL_LIST } from '../data/dapodikOptions';

interface DashboardStatsProps {
  students: Student[];
  onSelectRombelFilter: (rombel: string) => void;
  onSelectPipFilter: (status: string) => void;
  onSelectIncompleteFilter: () => void;
  selectedCompletenessFilter?: 'all' | 'complete' | 'incomplete';
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  students,
  onSelectRombelFilter,
  onSelectPipFilter,
  onSelectIncompleteFilter,
  selectedCompletenessFilter
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Compute key metrics
  const total = students.length;
  const laki = students.filter(s => s.jk === 'Laki-laki' || s.jk === 'L').length;
  const perempuan = students.filter(s => s.jk === 'Perempuan' || s.jk === 'P').length;
  const penerimaPip = students.filter(s => s.layakPip === 'Ya' || s.penerimaKip === 'Ya').length;

  // Compute completeness
  const completenessList = students.map(s => calculateStudentCompleteness(s));
  const avgCompleteness = total > 0 
    ? Math.round(completenessList.reduce((acc, curr) => acc + curr.percentage, 0) / total) 
    : 100;

  const incompleteCount = completenessList.filter(c => c.percentage < 85).length;

  // Calculate Male and Female counts per Rombel
  const uniqueRombelsInStudents: string[] = Array.from(new Set(students.map(s => s.rombel).filter(Boolean) as string[]));
  const rombelsToDisplay: string[] = Array.from(new Set<string>([...ROMBEL_LIST, ...uniqueRombelsInStudents])).sort((a, b) => 
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );

  const rombelGenderData = rombelsToDisplay.map(r => {
    const rombelStudents = students.filter(s => s.rombel === r);
    const countL = rombelStudents.filter(s => s.jk === 'Laki-laki' || s.jk === 'L').length;
    const countP = rombelStudents.filter(s => s.jk === 'Perempuan' || s.jk === 'P').length;
    const countTotal = rombelStudents.length;

    return {
      rombel: r,
      countL,
      countP,
      countTotal
    };
  });

  return (
    <div className="bg-slate-900 border-b border-slate-800 py-5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Card 1: Total Murid */}
          <div 
            onClick={() => onSelectRombelFilter('')}
            className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all hover:border-slate-600 group"
          >
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Murid</p>
              <h3 className="text-2xl font-black text-white mt-0.5 tracking-tight group-hover:text-emerald-400 transition-colors">
                {total} <span className="text-xs font-normal text-slate-400">murid</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Laki-Laki & Perempuan */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Rasio Gender</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-blue-400">{laki} L</span>
                <span className="text-slate-600">/</span>
                <span className="text-sm font-bold text-pink-400">{perempuan} P</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Penerima PIP / KIP */}
          <div 
            onClick={() => onSelectPipFilter('Ya')}
            className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all hover:border-emerald-500/50 group"
          >
            <div>
              <p className="text-xs text-slate-400 font-medium">Usulan / Penerima PIP</p>
              <h3 className="text-xl font-bold text-emerald-400 mt-0.5">
                {penerimaPip} <span className="text-xs font-normal text-slate-400">({total > 0 ? Math.round((penerimaPip/total)*100) : 0}%)</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Data Belum Lengkap */}
          <div 
            onClick={onSelectIncompleteFilter}
            className={`bg-slate-800/90 hover:bg-slate-800 border rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all group ${
              selectedCompletenessFilter === 'incomplete' 
                ? 'border-rose-500 ring-2 ring-rose-500/30' 
                : 'border-slate-700/80 hover:border-rose-500/50'
            }`}
            title="Klik untuk memfilter murid dengan data belum lengkap (<85%)"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-slate-400 font-medium">Data Belum Lengkap</p>
                {selectedCompletenessFilter === 'incomplete' && (
                  <span className="text-[10px] font-bold bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded">
                    Aktif
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-rose-400 mt-0.5 tracking-tight group-hover:text-rose-300 transition-colors">
                {incompleteCount} <span className="text-xs font-normal text-slate-400">murid</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          {/* Card 5: Kelengkapan Data Dapodik */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between col-span-2 sm:col-span-1">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium">Kelengkapan Data</p>
                <span className="text-xs font-bold text-emerald-400">{avgCompleteness}%</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    avgCompleteness > 80 ? 'bg-emerald-500' : avgCompleteness > 60 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${avgCompleteness}%` }}
                />
              </div>
              {incompleteCount > 0 && (
                <button
                  onClick={onSelectIncompleteFilter}
                  className="text-[10px] text-amber-400 hover:text-amber-300 mt-1 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  {incompleteCount} data belum lengkap (Filter)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section Toggle: Jumlah Siswa Laki-Laki & Perempuan per Rombel */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
          <div className="flex items-center space-x-2 text-xs text-slate-300 font-bold uppercase tracking-wider">
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            <span>Jumlah Siswa Laki-Laki & Perempuan per Rombel</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Sembunyikan Cards Rombel' : 'Tampilkan Cards Rombel'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Cards Grid: Male & Female breakdown per Rombel */}
        {isExpanded && (
          <div className="mt-3 pt-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {rombelGenderData.map(item => {
                const pctL = item.countTotal > 0 ? Math.round((item.countL / item.countTotal) * 100) : 0;
                
                return (
                  <div
                    key={item.rombel}
                    onClick={() => onSelectRombelFilter(item.rombel)}
                    className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all group hover:shadow-md hover:-translate-y-0.5"
                    title={`Klik untuk memfilter Rombel ${item.rombel}`}
                  >
                    <div>
                      {/* Rombel Title & Total Count Badge */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="font-black text-slate-100 text-sm tracking-tight group-hover:text-emerald-400 transition-colors">
                          Kelas {item.rombel}
                        </span>
                        <span className="bg-slate-700 text-slate-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0">
                          {item.countTotal} Siswa
                        </span>
                      </div>

                      {/* Gender Breakdown Details */}
                      <div className="space-y-1 my-1.5 text-xs">
                        <div className="flex items-center justify-between text-blue-400 font-semibold bg-blue-950/40 px-2 py-1 rounded-lg border border-blue-900/30">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            Laki-laki
                          </span>
                          <span className="font-mono font-bold">{item.countL}</span>
                        </div>

                        <div className="flex items-center justify-between text-pink-400 font-semibold bg-pink-950/40 px-2 py-1 rounded-lg border border-pink-900/30">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                            Perempuan
                          </span>
                          <span className="font-mono font-bold">{item.countP}</span>
                        </div>
                      </div>
                    </div>

                    {/* Proportional Split Progress Bar */}
                    <div className="mt-2 pt-1">
                      <div className="w-full bg-slate-700/80 h-2 rounded-full flex overflow-hidden">
                        {item.countTotal > 0 ? (
                          <>
                            <div 
                              className="bg-blue-500 h-full transition-all duration-300" 
                              style={{ width: `${pctL}%` }}
                              title={`Laki-laki: ${pctL}%`}
                            />
                            <div 
                              className="bg-pink-500 h-full transition-all duration-300" 
                              style={{ width: `${100 - pctL}%` }}
                              title={`Perempuan: ${100 - pctL}%`}
                            />
                          </>
                        ) : (
                          <div className="bg-slate-600 h-full w-full" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                        <span>{item.countTotal > 0 ? `${pctL}% L` : '0%'}</span>
                        <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity font-sans font-bold flex items-center gap-0.5">
                          <Filter className="w-2.5 h-2.5" /> Filter
                        </span>
                        <span>{item.countTotal > 0 ? `${100 - pctL}% P` : '0%'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


