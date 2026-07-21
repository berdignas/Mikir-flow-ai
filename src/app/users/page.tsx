'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthContext, UserRole } from '@/context/AuthContext';
import { useFlowContext } from '@/context/FlowContext';
import { 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  Code, 
  Eye, 
  UserCheck, 
  ShieldAlert, 
  ArrowLeft, 
  Folder, 
  CheckSquare,
  ChevronDown,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function UsersPage() {
  const { usersList, currentUser, addUser, deleteUser, updateUserRole, updateUserProjects } = useAuthContext();
  const { projectsList } = useFlowContext();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const isPM = currentUser?.role === 'pm';

  // Exclusive Guard: If logged in user is NOT a PM (Developer or Client), render PM-Exclusive Access Guard Card
  if (!isPM) {
    return (
      <div className="h-full w-full bg-[#F8F9FA] p-8 flex items-center justify-center font-sans select-none">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-center mx-auto text-[#EA580C]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Akses Terproteksi</h2>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Halaman <strong>Manajemen User & Hak Akses</strong> ini bersifat eksklusif dan hanya dapat diakses oleh akun berkewenangan <strong>Project Manager (PM)</strong>.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF6B4D] hover:bg-[#e65a3d] text-white text-xs font-bold rounded-2xl transition-all shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Workspace</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    addUser({
      name: name.trim(),
      email: email.trim(),
      role,
      status: 'Active',
      assignedProjectIds: role === 'client' ? selectedProjectIds : undefined,
    });
    setName('');
    setEmail('');
    setSelectedProjectIds([]);
    setIsAdding(false);
  };

  const toggleProjectSelection = (userId: string, currentAssigned: string[], projId: string) => {
    const updated = currentAssigned.includes(projId)
      ? currentAssigned.filter((id) => id !== projId)
      : [...currentAssigned, projId];
    updateUserProjects(userId, updated);
  };

  const toggleNewUserProjectSelection = (projId: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(projId) ? prev.filter((id) => id !== projId) : [...prev, projId]
    );
  };

  return (
    <div className="h-full w-full bg-[var(--color-surface)] p-8 overflow-y-auto font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#EA580C] border border-orange-200 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> EKSKLUSIF PM
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen User & Hak Akses Proyek</h1>
            <p className="text-sm text-gray-500">Kelola pengguna dan atur proyek mana saja yang dimiliki oleh masing-masing Klien.</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-2 bg-[#FF6B4D] hover:bg-[#e65a3d] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            + Tambah User Baru
          </button>
        </div>

        {/* Form Collapsible for Adding User */}
        {isAdding && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#FF6B4D]" /> Tambah Anggota / Klien Baru
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Nama Lengkap</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: PT Javas (Klien)"
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-sm bg-white focus:outline-none focus:border-[#FF6B4D] font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@javas.co.id"
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-sm bg-white focus:outline-none focus:border-[#FF6B4D] font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Peran (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-sm bg-white focus:outline-none focus:border-[#FF6B4D] font-medium cursor-pointer"
                  >
                    <option value="client">Client (Pemilik Proyek)</option>
                    <option value="developer">Developer / Programmer</option>
                    <option value="pm">Project Manager (PM)</option>
                  </select>
                </div>
              </div>

              {/* Assign Projects to Client Selector */}
              {role === 'client' && (
                <div className="pt-2 border-t border-gray-200">
                  <label className="text-xs font-bold text-gray-900 block mb-2">
                    Pilih Proyek Yang Dimiliki Klien Ini:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {projectsList.map((p) => {
                      const isSelected = selectedProjectIds.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleNewUserProjectSelection(p.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs' 
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <Folder className="w-3.5 h-3.5" />
                          <span>{p.title}</span>
                          {isSelected && <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#FF6B4D] hover:bg-[#e65a3d] text-white rounded-xl cursor-pointer shadow-md"
                >
                  Simpan User
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-visible shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Pengguna</th>
                <th className="py-3.5 px-6">Peran (Role)</th>
                <th className="py-3.5 px-6">Proyek Dimiliki (Pemilik Proyek)</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersList.map((u) => {
                const assignedIds = u.assignedProjectIds || [];
                return (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-orange-100 text-[#FF6B4D] font-bold text-sm flex items-center justify-center border border-orange-200 shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {u.name}
                            {currentUser?.id === u.id && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                                <UserCheck className="w-3 h-3" /> Anda
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Custom Design System Role Dropdown Component */}
                    <td className="py-4 px-6 relative">
                      {currentUser?.id !== u.id ? (
                        <CustomRoleDropdown 
                          currentRole={u.role} 
                          onChange={(newRole) => updateUserRole(u.id, newRole)} 
                        />
                      ) : (
                        <StaticRoleBadge role={u.role} />
                      )}
                    </td>

                    {/* Proyek Dimiliki (Multi-Project Assignment Selector for Clients) */}
                    <td className="py-4 px-6">
                      {u.role === 'client' ? (
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {projectsList.map((p) => {
                            const isAssigned = assignedIds.includes(p.id);
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => toggleProjectSelection(u.id, assignedIds, p.id)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                                  isAssigned
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                                    : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                                }`}
                                title={isAssigned ? 'Klik untuk cabut hak proyek' : 'Klik untuk jadikan Pemilik Proyek ini'}
                              >
                                <Folder className="w-3 h-3 shrink-0" />
                                <span className="truncate max-w-[140px]">{p.title}</span>
                                {isAssigned && <CheckSquare className="w-3 h-3 text-emerald-600 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Semua Proyek Workspace</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {currentUser?.id !== u.id && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Custom Design System Compliant Role Dropdown
function CustomRoleDropdown({
  currentRole,
  onChange,
}: {
  currentRole: UserRole;
  onChange: (newRole: UserRole) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleConfigs: Record<UserRole, { label: string; badgeClass: string; icon: any }> = {
    pm: {
      label: 'Project Manager',
      badgeClass: 'bg-[#FFEDD5] text-[#EA580C] border-orange-200/80 hover:bg-orange-100',
      icon: ShieldCheck,
    },
    developer: {
      label: 'Developer',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100',
      icon: Code,
    },
    client: {
      label: 'Client (Pemilik Proyek)',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100',
      icon: Eye,
    },
  };

  const activeConfig = roleConfigs[currentRole];
  const IconComp = activeConfig.icon;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${activeConfig.badgeClass}`}
      >
        <span className="flex items-center gap-1.5">
          <IconComp className="w-3.5 h-3.5" />
          {activeConfig.label}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Design System Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-60 bg-white rounded-2xl border border-gray-200 shadow-[0_12px_30px_rgba(0,0,0,0.12)] p-1.5 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          {(['pm', 'developer', 'client'] as UserRole[]).map((r) => {
            const cfg = roleConfigs[r];
            const OptionIcon = cfg.icon;
            const isSelected = currentRole === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => {
                  onChange(r);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected ? 'bg-gray-100 font-bold text-gray-900' : 'hover:bg-gray-50 text-gray-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`p-1 rounded-lg border ${cfg.badgeClass}`}>
                    <OptionIcon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs">{cfg.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#FF6B4D]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Static Role Badge for Current Logged In User Row
function StaticRoleBadge({ role }: { role: UserRole }) {
  if (role === 'pm') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-[#FFEDD5] text-[#EA580C] text-xs font-semibold px-3 py-1.5 rounded-xl border border-orange-200">
        <ShieldCheck className="w-3.5 h-3.5" /> Project Manager
      </span>
    );
  }
  if (role === 'developer') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-blue-200">
        <Code className="w-3.5 h-3.5" /> Developer
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200">
      <Eye className="w-3.5 h-3.5" /> Client (Pemilik Proyek)
    </span>
  );
}
