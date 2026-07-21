'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Trash2, Upload, Plus, ChevronDown, Check, Save, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { useFlowContext } from '@/context/FlowContext';
import { useAuthContext } from '@/context/AuthContext';

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white p-2.5 text-xs font-semibold text-[#0A0A0A] hover:border-[#FF6B4D] focus:border-[#FF6B4D] focus:outline-none cursor-pointer shadow-2xs transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className={selectedOption ? 'text-[#0A0A0A]' : 'text-[#6B7280]'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#FF6B4D]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-0.5">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50 text-[#FF6B4D] font-bold border border-orange-200/80'
                    : 'hover:bg-gray-50 text-[#0A0A0A]'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#FF6B4D]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SubfeaturePillManager({ activeNodeId, items = [], isClient = false }: { activeNodeId: string; items: string[]; isClient?: boolean }) {
  const { updateNodeData } = useFlowContext();
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim() || isClient) return;
    updateNodeData(activeNodeId, { items: [...items, newItem.trim()] });
    setNewItem('');
  };

  const handleRemoveItem = (index: number) => {
    if (isClient) return;
    const updated = items.filter((_, i) => i !== index);
    updateNodeData(activeNodeId, { items: updated });
  };

  return (
    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <label className="text-xs font-semibold text-gray-700 block">Daftar Item Sub-Fitur (Pills)</label>
      
      {/* Active pills list */}
      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <span className="text-xs text-gray-400 italic">Belum ada item sub-fitur</span>
        ) : (
          items.map((item, idx) => (
            <span 
              key={idx} 
              className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 text-xs px-2.5 py-1 rounded-full shadow-2xs"
            >
              {item}
              {!isClient && (
                <button 
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-gray-400 hover:text-red-500 cursor-pointer font-bold text-xs"
                >
                  ×
                </button>
              )}
            </span>
          ))
        )}
      </div>

      {/* Add new pill input */}
      {!isClient && (
        <form onSubmit={handleAddItem} className="flex gap-2">
          <input 
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Ketik item baru..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs bg-white focus:border-[var(--color-primary)] focus:outline-none"
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md cursor-pointer transition-colors shrink-0 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah
          </button>
        </form>
      )}
    </div>
  );
}

export type CommentItem = {
  id: string;
  user: string;
  role: string;
  text: string;
  time: string;
};

export default function RightDrawer() {
  const { activeNodeId, setActiveNodeId, nodes, updateNodeData, deleteNode } = useFlowContext();
  const { currentUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'prd' | 'feedback'>('prd');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [newFeedbackText, setNewFeedbackText] = useState('');

  const isClient = currentUser?.role === 'client';

  const activeNode = nodes.find(n => n.id === activeNodeId);
  const isOpen = !!activeNode;
  const nodeTitle = activeNode?.data?.title || '';
  const nodeData = activeNode?.data || {};

  const defaultComments: CommentItem[] = [
    { id: '1', user: 'Klien PT Javas', role: 'client', text: 'Tolong pastikan sub-fitur pembayaran QRIS mendukung notifikasi webhook real-time ya.', time: '2 jam yang lalu' }
  ];

  const comments: CommentItem[] = (nodeData.comments as CommentItem[]) || defaultComments;

  const handleSaveDraft = () => {
    if (!activeNodeId) return;
    updateNodeData(activeNodeId, {
      status: (nodeData.status as string) || 'Sedang Dikerjakan'
    });
    setToastMsg('Draf sementara disimpan! Silakan diskusikan lebih lanjut di tab Feedback.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleApproveModule = () => {
    if (!activeNodeId) return;
    updateNodeData(activeNodeId, {
      status: 'Selesai'
    });
    setToastMsg('Modul disetujui & dipindahkan ke Task Developer!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackText.trim() || !activeNodeId) return;

    const newComment: CommentItem = {
      id: Date.now().toString(),
      user: currentUser?.name || 'User',
      role: currentUser?.role || 'pm',
      text: newFeedbackText.trim(),
      time: 'Baru saja'
    };

    const updatedComments = [...comments, newComment];
    updateNodeData(activeNodeId, { comments: updatedComments });
    setNewFeedbackText('');
    setToastMsg('Feedback berhasil dikirim & disimpan!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getRoleBadgeStyle = (r: string) => {
    if (r === 'pm') return 'bg-[#FFEDD5] text-[#EA580C] border-orange-200';
    if (r === 'developer') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  if (!isOpen) {
    return <aside className="fixed right-0 top-16 bottom-0 w-[400px] border-l border-[var(--color-border)] bg-[var(--color-surface)] shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 flex flex-col transition-transform duration-300 translate-x-full"></aside>;
  }

  return (
    <aside 
      className={`fixed right-0 top-16 bottom-0 w-[400px] border-l border-[var(--color-border)] bg-[var(--color-surface)] shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-6 shrink-0">
        <div className="flex-1 mr-4">
          <input 
            type="text"
            disabled={isClient}
            className="text-lg font-semibold text-[var(--color-text-primary)] bg-transparent border-none outline-none w-full disabled:opacity-80"
            value={nodeTitle as string}
            onChange={(e) => updateNodeData(activeNodeId!, { title: e.target.value })}
            placeholder="Nama Fitur/Node"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {!isClient && (
            <button onClick={() => deleteNode(activeNodeId!)} className="text-red-500 hover:text-red-600 p-1 cursor-pointer transition-colors rounded hover:bg-red-50" title="Hapus Node">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => setActiveNodeId(null)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-1 cursor-pointer transition-colors rounded hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border)] px-6 gap-4 shrink-0">
        <button 
          onClick={() => setActiveTab('prd')}
          className={`py-3 px-2 text-sm font-medium border-b-2 cursor-pointer transition-colors ${activeTab === 'prd' ? 'border-[var(--color-primary)] text-[var(--color-primary)] font-semibold' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
        >
          Input PRD
        </button>
        <button 
          onClick={() => setActiveTab('feedback')}
          className={`py-3 px-2 text-sm font-medium border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${activeTab === 'feedback' ? 'border-[var(--color-primary)] text-[var(--color-primary)] font-semibold' : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Feedback ({comments.length})</span>
        </button>
      </div>

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'prd' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#0A0A0A]">Fase</label>
                <CustomSelect
                  disabled={isClient}
                  placeholder="- Pilih Fase -"
                  value={(nodeData.phase as string) || ''}
                  onChange={(val) => updateNodeData(activeNodeId!, { phase: val })}
                  options={[
                    { label: 'FASE 1', value: 'FASE 1' },
                    { label: 'FASE 2', value: 'FASE 2' },
                    { label: 'MVP', value: 'MVP' },
                    { label: 'BACKLOG', value: 'BACKLOG' },
                  ]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#0A0A0A]">Status</label>
                <CustomSelect
                  disabled={isClient}
                  placeholder="- Pilih Status -"
                  value={(nodeData.status as string) || ''}
                  onChange={(val) => updateNodeData(activeNodeId!, { status: val })}
                  options={[
                    { label: 'Direncanakan', value: 'Direncanakan' },
                    { label: 'Sedang Dikerjakan', value: 'Sedang Dikerjakan' },
                    { label: 'Review', value: 'Review' },
                    { label: 'Selesai', value: 'Selesai' },
                  ]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Deskripsi (Goals)</label>
              <textarea 
                disabled={isClient}
                className="w-full rounded-xl border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-primary)] focus:outline-none min-h-[60px] disabled:opacity-80 disabled:bg-gray-50"
                value={(nodeData.goals as string) || ''}
                onChange={(e) => updateNodeData(activeNodeId!, { goals: e.target.value })}
                placeholder="Tujuan fitur ini dibuat..."
              />
            </div>

            {activeNode?.type === 'subfeatureNode' && (
              <SubfeaturePillManager 
                activeNodeId={activeNodeId!} 
                items={(nodeData.items as string[]) || []} 
                isClient={isClient}
              />
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">User Story</label>
              <textarea 
                disabled={isClient}
                className="w-full rounded-xl border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] min-h-[80px] disabled:opacity-80 disabled:bg-gray-50"
                value={(nodeData.userStory as string) || ''}
                onChange={(e) => updateNodeData(activeNodeId!, { userStory: e.target.value })}
                placeholder="Sebagai user, saya ingin..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Acceptance Criteria</label>
              <textarea 
                disabled={isClient}
                className="w-full rounded-xl border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] min-h-[100px] disabled:opacity-80 disabled:bg-gray-50"
                value={(nodeData.acceptanceCriteria as string) || ''}
                onChange={(e) => updateNodeData(activeNodeId!, { acceptanceCriteria: e.target.value })}
                placeholder="1. Kriteria kualifikasi..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Dependencies</label>
              <input 
                type="text"
                disabled={isClient}
                className="w-full rounded-xl border border-[var(--color-border)] p-2.5 text-sm focus:border-[var(--color-primary)] focus:outline-none disabled:opacity-80 disabled:bg-gray-50"
                value={(nodeData.dependencies as string) || ''}
                onChange={(e) => updateNodeData(activeNodeId!, { dependencies: e.target.value })}
                placeholder="Misal: API Gateway, User Auth"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">Referensi UI (Gambar)</label>
              <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
                <Upload className="h-6 w-6 mb-2 text-gray-400" />
                <span className="text-xs">Klik untuk upload atau drag gambar ke sini</span>
              </div>
            </div>
          </>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            
            {/* Feedback List */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#0A0A0A] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#FF6B4D]" />
                Feedback & Catatan Modul ({comments.length})
              </p>

              {comments.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-gray-200 rounded-xl">
                  <p className="text-xs text-gray-400 italic">Belum ada feedback. Ketik feedback pertama di bawah ini!</p>
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="rounded-xl border border-gray-200 p-3.5 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#FF6B4D] to-amber-400 text-white font-bold text-xs flex items-center justify-center">
                          {c.user.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-900 block leading-tight">{c.user}</span>
                          <span className={`inline-block text-[9px] font-semibold px-1.5 py-0.2 rounded border capitalize ${getRoleBadgeStyle(c.role)}`}>
                            {c.role}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{c.time}</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed bg-gray-50/70 p-2.5 rounded-lg border border-gray-100">
                      {c.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Input Form for New Feedback (Allowed for ALL roles: Client, PM, Dev) */}
            <form onSubmit={handleAddFeedback} className="space-y-2.5 pt-4 border-t border-gray-200">
              <label className="text-xs font-bold text-gray-900 block">
                Tambah Feedback / Catatan Diskusi
              </label>
              <textarea 
                rows={3}
                value={newFeedbackText}
                onChange={(e) => setNewFeedbackText(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 text-xs bg-white focus:outline-none focus:border-[#FF6B4D] shadow-2xs"
                placeholder="Ketik feedback, pertanyaan, atau catatan untuk tim..."
                required
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#FF6B4D] hover:brightness-110 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Feedback</span>
              </button>
            </form>

          </div>
        )}
      </div>

      {/* Action Footer: Simpan Draf Sementara & Setujui Modul */}
      {!isClient && (
        <div className="border-t border-[var(--color-border)] p-5 bg-gray-50/80 shrink-0 space-y-2.5">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold py-2.5 px-4 shadow-2xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-orange-600" />
            <span>Simpan Draf / Perubahan Sementara</span>
          </button>

          <button
            type="button"
            onClick={handleApproveModule}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-4 shadow-md transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Setujui Modul & Lempar ke Task</span>
          </button>
        </div>
      )}
    </aside>
  );
}
