import React, { useState } from 'react';
import { X, Save, School, Upload, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { SchoolInfo } from '../types';
import { saveSchoolInfo } from '../utils/storage';

interface SchoolSettingsModalProps {
  schoolInfo: SchoolInfo;
  onSave: (info: SchoolInfo) => void;
  onClose: () => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  schoolInfo,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<SchoolInfo>({ ...schoolInfo });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'pemda' | 'sekolah') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (type === 'pemda') {
        setFormData(prev => ({ ...prev, logoPemda: result }));
      } else {
        setFormData(prev => ({ ...prev, logoSekolah: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = (type: 'pemda' | 'sekolah') => {
    if (type === 'pemda') {
      setFormData(prev => ({ ...prev, logoPemda: undefined }));
    } else {
      setFormData(prev => ({ ...prev, logoSekolah: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSchoolInfo(formData);
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <School className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold">Pengaturan Profil Sekolah & Akademik</h2>
              <p className="text-xs text-slate-400">Atur Identitas Satuan Pendidikan & Tahun Ajaran Aktiv</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="font-semibold block mb-1">Nama Satuan Pendidikan (Sekolah) *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">NPSN (Nomor Pokok Sekolah Nasional) *</label>
              <input
                type="text"
                required
                value={formData.npsn}
                onChange={e => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Nomor Telepon Sekolah</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold block mb-1">Alamat Lengkap Sekolah</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Kecamatan</label>
              <input
                type="text"
                value={formData.kecamatan}
                onChange={e => setFormData({ ...formData, kecamatan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Kabupaten / Kota</label>
              <input
                type="text"
                value={formData.kabupaten}
                onChange={e => setFormData({ ...formData, kabupaten: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="border-t pt-3 md:col-span-2 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                Pengaturan Logo Kop Surat & Administrasi
              </h4>
              <p className="text-[11px] text-slate-500">
                Upload logo kustom untuk Logo Pemda (sisi kiri kop surat) dan Logo Sekolah (sisi kanan kop surat). Logo akan tersimpan otomatis.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Logo Pemda */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Logo Pemda (Kiri)</span>
                    {formData.logoPemda && (
                      <button
                        type="button"
                        onClick={() => handleResetLogo('pemda')}
                        className="text-rose-600 hover:underline text-[10px] flex items-center gap-0.5 cursor-pointer font-medium"
                      >
                        <RotateCcw className="w-3 h-3" /> Hapus Logo
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 border border-slate-300 rounded-lg bg-white flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      {formData.logoPemda ? (
                        <img src={formData.logoPemda} alt="Logo Pemda" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-[9px] text-slate-400 font-bold text-center">Default Pemda</span>
                      )}
                    </div>
                    <label className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 cursor-pointer hover:bg-slate-100 flex items-center justify-center gap-1.5 text-xs font-semibold shadow-2xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{formData.logoPemda ? 'Ganti Logo Pemda' : 'Upload Logo Pemda'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleLogoUpload(e, 'pemda')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Logo Sekolah */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Logo Sekolah (Kanan)</span>
                    {formData.logoSekolah && (
                      <button
                        type="button"
                        onClick={() => handleResetLogo('sekolah')}
                        className="text-rose-600 hover:underline text-[10px] flex items-center gap-0.5 cursor-pointer font-medium"
                      >
                        <RotateCcw className="w-3 h-3" /> Hapus Logo
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 border border-slate-300 rounded-lg bg-white flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      {formData.logoSekolah ? (
                        <img src={formData.logoSekolah} alt="Logo Sekolah" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-[9px] text-slate-400 font-bold text-center">Default Sekolah</span>
                      )}
                    </div>
                    <label className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 cursor-pointer hover:bg-slate-100 flex items-center justify-center gap-1.5 text-xs font-semibold shadow-2xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{formData.logoSekolah ? 'Ganti Logo Sekolah' : 'Upload Logo Sekolah'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleLogoUpload(e, 'sekolah')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-3 md:col-span-2">
              <h4 className="font-bold text-slate-900 mb-2">Penandatangan Resmi & Tahun Ajaran</h4>
            </div>

            <div>
              <label className="font-semibold block mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={formData.kepalaSekolah}
                onChange={e => setFormData({ ...formData, kepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={formData.nipKepala}
                onChange={e => setFormData({ ...formData, nipKepala: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Tahun Ajaran Active</label>
              <input
                type="text"
                value={formData.tahunAjaran}
                onChange={e => setFormData({ ...formData, tahunAjaran: e.target.value })}
                placeholder="2025/2026"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Semester Active</label>
              <select
                value={formData.semester}
                onChange={e => setFormData({ ...formData, semester: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
