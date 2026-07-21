'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Plus, 
  LayoutTemplate, 
  FileText, 
  CheckSquare, 
  FolderGit2, 
  PanelLeftClose, 
  PanelLeftOpen,
  Folder,
  Check,
  Trash2
} from 'lucide-react';
import Logo from './Logo';
import { useSidebar } from '@/context/SidebarContext';
import { useFlowContext } from '@/context/FlowContext';
import { useAuthContext } from '@/context/AuthContext';
import AddProjectModal from './AddProjectModal';

export default function LeftSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { projectsList, activeProjectId, setActiveProjectId, deleteProject } = useFlowContext();
  const { currentUser } = useAuthContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isPM = currentUser?.role === 'pm';
  const isClient = currentUser?.role === 'client';

  // Filter project list for Client role (Only show projects owned by this Client)
  const visibleProjects = isClient && currentUser?.assignedProjectIds && currentUser.assignedProjectIds.length > 0
    ? projectsList.filter(p => currentUser.assignedProjectIds?.includes(p.id))
    : projectsList;

  const handleDeleteProject = async (e: React.MouseEvent, projId: string, projTitle: string) => {
    e.stopPropagation();
    if (isClient) return;
    if (confirm(`Apakah Anda yakin ingin menghapus proyek "${projTitle}"?`)) {
      await deleteProject(projId);
    }
  };

  // Collapsed View (Icon Only Rail)
  if (!isSidebarOpen) {
    return (
      <aside className="w-16 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col items-center py-4 h-full shrink-0 z-30 transition-all duration-300">
        {/* Toggle Icon Button Only (No Text) */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-[#FF6B4D] hover:bg-orange-50 p-2.5 rounded-xl transition-all cursor-pointer mb-6"
          title="Tampilkan Sidebar"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>

        {/* Collapsed Icon Nav */}
        <nav className="flex-1 space-y-3">
          {/* PRD Spec Icon (Hidden for Client) */}
          {!isClient && (
            <Link 
              href="/prd" 
              className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${pathname === '/prd' ? 'bg-orange-50 text-[var(--color-primary)] font-bold' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
              title="PRD Spec"
            >
              <FileText className="w-5 h-5" />
            </Link>
          )}

          <Link 
            href="/" 
            className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${pathname === '/' ? 'bg-orange-50 text-[var(--color-primary)] font-bold' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
            title="Flow Diagram"
          >
            <LayoutTemplate className="w-5 h-5" />
          </Link>

          <Link 
            href="/task" 
            className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${pathname === '/task' ? 'bg-orange-50 text-[var(--color-primary)] font-bold' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
            title="Developer Task"
          >
            <CheckSquare className="w-5 h-5" />
          </Link>

          {/* User Management Icon (Exclusive to PM Only) */}
          {isPM && (
            <Link 
              href="/users" 
              className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${pathname === '/users' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
              title="Manajemen User (PM Only)"
            >
              <FolderGit2 className="w-5 h-5" />
            </Link>
          )}
        </nav>

        {/* Add Project Quick Icon (PM & Dev Only) */}
        {!isClient && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="p-2.5 rounded-xl text-gray-400 hover:text-[#FF6B4D] hover:bg-orange-50 transition-colors cursor-pointer mb-2"
            title="Tambah Proyek Baru"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}

        <AddProjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </aside>
    );
  }

  // Expanded View
  return (
    <aside className="w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col h-full shrink-0 z-30 transition-all duration-300">
      
      {/* Workspace Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4">
        <Logo size="small" />
        
        {/* Toggle Icon Button Only (No Text) */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-[#FF6B4D] hover:bg-orange-50 p-2 rounded-xl transition-all cursor-pointer"
          title="Sembunyikan Sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        
        {/* Workspace Views */}
        <div>
          <p className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 px-2">Views</p>
          <ul className="space-y-1">
            {/* PRD Spec Link (Hidden for Client) */}
            {!isClient && (
              <li>
                <Link href="/prd" className={`w-full flex items-center gap-3 px-2.5 py-2 text-sm font-medium rounded-xl cursor-pointer transition-colors ${pathname === '/prd' ? 'bg-orange-50 text-[var(--color-primary)] font-semibold' : 'hover:bg-gray-100 text-[var(--color-text-secondary)]'}`}>
                  <FileText className="w-4 h-4" />
                  <span>PRD Spec</span>
                </Link>
              </li>
            )}
            <li>
              <Link href="/" className={`w-full flex items-center gap-3 px-2.5 py-2 text-sm font-medium rounded-xl cursor-pointer transition-colors ${pathname === '/' ? 'bg-orange-50 text-[var(--color-primary)] font-semibold' : 'hover:bg-gray-100 text-[var(--color-text-secondary)]'}`}>
                <LayoutTemplate className="w-4 h-4" />
                <span>Flow Diagram</span>
              </Link>
            </li>
            <li>
              <Link href="/task" className={`w-full flex items-center gap-3 px-2.5 py-2 text-sm font-medium rounded-xl cursor-pointer transition-colors ${pathname === '/task' ? 'bg-orange-50 text-[var(--color-primary)] font-semibold' : 'hover:bg-gray-100 text-[var(--color-text-secondary)]'}`}>
                <CheckSquare className="w-4 h-4" />
                <span>Developer Task</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Antigravity-Style Project Switcher Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              {isClient ? 'Proyek Saya' : 'Daftar Proyek'}
            </p>
            <span className="text-[10px] font-bold text-[#EA580C] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/60">
              {visibleProjects.length}
            </span>
          </div>

          <ul className="space-y-1">
            {visibleProjects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <li key={proj.id} className="group/item relative">
                  <div
                    onClick={() => setActiveProjectId(proj.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer text-left ${
                      isActive 
                        ? 'bg-orange-50 text-[var(--color-primary)] font-semibold' 
                        : 'hover:bg-gray-100 text-[var(--color-text-secondary)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate pr-6">
                      <Folder className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                      <span className="truncate">{proj.title}</span>
                    </div>

                    {/* Delete Project Action Button (PM & Dev Only) */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isActive && <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0" />}
                      {!isClient && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteProject(e, proj.id, proj.title)}
                          className="opacity-0 group-hover/item:opacity-100 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Hapus Proyek"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Team & Access (EXCLUSIVELY FOR PM ROLE ONLY) */}
        {isPM && (
          <div>
             <div className="flex items-center justify-between px-2 mb-2">
               <p className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Tim & Akses</p>
             </div>
             <ul className="space-y-1">
               <li>
                 <Link href="/users" className={`w-full flex items-center gap-3 px-2.5 py-2 text-sm font-medium rounded-xl cursor-pointer transition-colors ${pathname === '/users' ? 'bg-gray-100 text-gray-900 font-semibold' : 'hover:bg-gray-100 text-[var(--color-text-secondary)]'}`}>
                   <FolderGit2 className="w-4 h-4" />
                   <span className="truncate">Manajemen User</span>
                 </Link>
               </li>
             </ul>
          </div>
        )}

      </nav>

      {/* Add Project Button (PM & Dev Only) */}
      {!isClient && (
        <div className="p-4 border-t border-[var(--color-border)]">
          <button 
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-orange-50 hover:text-[var(--color-primary)] hover:border-orange-200 transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      )}

      <AddProjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </aside>
  );
}
