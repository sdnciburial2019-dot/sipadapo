import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Award, 
  TrendingUp, 
  BarChart3,
  MapPin,
  Wallet,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Student } from '../types';
import { calculateStudentCompleteness } from '../utils/storage';

interface DashboardStatsProps {
  students: Student[];
  onSelectRombelFilter: (rombel: string) => void;
  onSelectPipFilter: (status: string) => void;
  onSelectIncompleteFilter: () => void;
  selectedCompletenessFilter?: 'all' | 'complete' | 'incomplete';
}

export function extractDesaKelurahan(s: Student): string {
  if ((s as any).desaKelurahan && String((s as any).desaKelurahan).trim().length > 0) {
    let d = String((s as any).desaKelurahan).trim();
    if (!/^(desa|kelurahan|kel\.|ds\.)/i.test(d)) {
      d = `Desa ${d}`;
    }
    return d;
  }

  const alamat = (s.alamat || '').trim();
  if (!alamat) return 'Desa Belum Diisi';

  const matchDesa = alamat.match(/(?:Desa|Kelurahan|Kel\.|Ds\.)\s+([A-Za-z0-9\s]+)/i);
  if (matchDesa && matchDesa[1]) {
    let desaName = matchDesa[1].split(/(?:\s+Rt|\s+Rw|\s+Kec|\s+Kab|\s+\d)/i)[0].trim();
    if (desaName) {
      return `Desa ${desaName.charAt(0).toUpperCase() + desaName.slice(1)}`;
    }
  }

  const knownDesa = [
    'Cibogo', 'Langensari', 'Lembang', 'Gudangkahuripan', 'Cikole', 
    'Jayagiri', 'Cikidang', 'Kayuambon', 'Wangunsari', 'Sukajaya', 
    'Padasuka', 'Cipangeran', 'Mekarwangi', 'Suntenjaya', 'Cikahuripan'
  ];

  for (const kd of knownDesa) {
    if (new RegExp(`\\b${kd}\\b`, 'i').test(alamat)) {
      return `Desa ${kd}`;
    }
  }

  return 'Desa Lembang';
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
  const laki = students.filter(s => s.jk === 'Laki-laki').length;
  const perempuan = students.filter(s => s.jk === 'Perempuan').length;
  const penerimaPip = students.filter(s => s.layakPip === 'Ya' || s.penerimaKip === 'Ya').length;

  // Compute completeness
  const completenessList = students.map(s => calculateStudentCompleteness(s));
  const avgCompleteness = total > 0 
    ? Math.round(completenessList.reduce((acc, curr) => acc + curr.percentage, 0) / total) 
    : 100;

  const incompleteCount = completenessList.filter(c => c.percentage < 85).length;

  // Chart Data 1: Rombel Distribution
  const rombelCounts: Record<string, number> = {};
  students.forEach(s => {
    const r = s.rombel || 'Lainnya';
    rombelCounts[r] = (rombelCounts[r] || 0) + 1;
  });

  const rombelData = Object.keys(rombelCounts)
    .sort()
    .map(r => ({
      name: r,
      jumlah: rombelCounts[r]
    }));

  // Chart Data 2: Address Distribution Berdasarkan Desa / Kelurahan
  const addressCounts: Record<string, number> = {};
  students.forEach(s => {
    const desaName = extractDesaKelurahan(s);
    addressCounts[desaName] = (addressCounts[desaName] || 0) + 1;
  });
  const addressData = Object.keys(addressCounts)
    .sort()
    .map(loc => ({
      name: loc,
      jumlah: addressCounts[loc]
    }));

  // Chart Data 3: Father's Income (Penghasilan Ayah)
  const fatherIncomeCounts: Record<string, number> = {};
  students.forEach(s => {
    const inc = s.penghasilanAyah || 'Belum Diisi';
    fatherIncomeCounts[inc] = (fatherIncomeCounts[inc] || 0) + 1;
  });
  const fatherIncomeData = Object.keys(fatherIncomeCounts).map(inc => ({
    name: inc,
    jumlah: fatherIncomeCounts[inc]
  }));

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

          {/* Card 4: Data Belum Lengkap (Replaces Pemegang KPS/PKH) */}
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

        {/* Analytics Section Toggle */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Grafik Analytics & Rekapitulasi Dapodik</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Sembunyikan Grafik' : 'Tampilkan Grafik Detail'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Detailed Recharts Visualizations */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-1">
            {/* Chart 1: Rombel Bar Chart */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
                Jumlah Murid per Rombel (Kelas)
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rombelData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                    />
                    <Bar dataKey="jumlah" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Sebaran Alamat Murid Berdasarkan Desa / Kelurahan */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                Grafik Sebaran Alamat Murid Berdasarkan Desa / Kelurahan
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={addressData} layout="vertical">
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} width={100} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                    />
                    <Bar dataKey="jumlah" fill="#ec4899" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Penghasilan Ayah Murid */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                Grafik Penghasilan Ayah Murid
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fatherIncomeData} layout="vertical">
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} tickLine={false} width={95} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                    />
                    <Bar dataKey="jumlah" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

