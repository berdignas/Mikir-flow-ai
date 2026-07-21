'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useFlowContext } from '@/context/FlowContext';
import { useRouter } from 'next/navigation';

export default function AddProjectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createNewProject } = useFlowContext();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [prdText, setPrdText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    setIsLoading(true);
    await createNewProject(title.trim(), clientName.trim(), prdText.trim());
    setIsLoading(false);

    setTitle('');
    setClientName('');
    setPrdText('');
    onClose();
    
    // Redirect to PRD Page for the new clean project
    router.push('/prd');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Clean Modal Header - Title & Close Button Only */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">Buat Proyek Baru</h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean Modal Form Without Input Icons or Placeholders */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nama Proyek */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 block">
              Nama Proyek <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=""
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-[#FF6B4D] focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Nama Klien / Perusahaan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 block">
              Nama Klien / Perusahaan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder=""
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-[#FF6B4D] focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Ringkasan PRD */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 block">
              Ringkasan PRD / Fitur Awal (Opsional)
            </label>
            <textarea
              rows={3}
              value={prdText}
              onChange={(e) => setPrdText(e.target.value)}
              placeholder=""
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-[#FF6B4D] focus:bg-white transition-all font-medium resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-[#FF6B4D] hover:bg-[#e65a3d] text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? 'Membuat Proyek...' : 'Buat Proyek Baru'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
