'use client';

import { useState, useRef, useEffect } from 'react';
import { useFlowContext } from '@/context/FlowContext';
import { useAuthContext, UserAccount } from '@/context/AuthContext';
import { 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  MessageSquare, 
  X,
  Paperclip,
  Check,
  Layers,
  Component
} from 'lucide-react';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export default function TaskPage() {
  const { nodes, updateNodeData, activeProject } = useFlowContext();
  const { currentUser, usersList } = useAuthContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const isClient = currentUser?.role === 'client';
  const isPM = currentUser?.role === 'pm';

  // Filter approved modules (status === 'Selesai' or nodes with tasks)
  const taskNodes = nodes.filter(n => n.type !== 'rootNode' && (n.data.status === 'Selesai' || n.data.taskStatus));

  // Get developer list for assignment
  const developers = usersList.filter(u => u.role === 'developer' || u.role === 'pm');

  const getTaskStatus = (node: any): TaskStatus => {
    return (node.data.taskStatus as TaskStatus) || 'todo';
  };

  const setTaskStatus = (nodeId: string, status: TaskStatus) => {
    updateNodeData(nodeId, { taskStatus: status });
  };

  const assignDeveloper = (nodeId: string, dev: UserAccount | null) => {
    if (!isPM) return;
    updateNodeData(nodeId, {
      assignedDevId: dev ? dev.id : null,
      assignedDevName: dev ? dev.name : null,
      assignedDevEmail: dev ? dev.email : null,
    });
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (isClient) return;
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      setTaskStatus(taskId, targetStatus);
    }
  };

  const todoTasks = taskNodes.filter(n => getTaskStatus(n) === 'todo');
  const inProgressTasks = taskNodes.filter(n => getTaskStatus(n) === 'in_progress');
  const reviewTasks = taskNodes.filter(n => getTaskStatus(n) === 'review');
  const doneTasks = taskNodes.filter(n => getTaskStatus(n) === 'done');

  const selectedNode = nodes.find(n => n.id === selectedTaskId);

  return (
    <div className="text-[#0A0A0A] h-full overflow-hidden flex flex-col bg-[#F8F9FA] font-sans">
      
      {/* Dynamic Header displaying Active Project */}
      <div className="p-8 pb-4 flex justify-between items-center shrink-0 border-b border-gray-200/80 bg-white z-10">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-gray-900">Board Task Developer</h1>
          <p className="text-sm font-medium text-orange-600">
            {activeProject ? `${activeProject.title} (${activeProject.client_name})` : 'E-Commerce Platform (PT Javas)'}
          </p>
        </div>
      </div>

      {/* Main Canvas Scroll Area with Drag and Drop Support */}
      <div className="flex gap-6 overflow-x-auto px-8 pt-4 pb-8 flex-1 items-start w-full">
        
        {/* Column 1: Started (To Do) */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragOverColumn('todo'); }}
          onDragLeave={() => setDragOverColumn(null)}
          onDrop={(e) => handleDrop(e, 'todo')}
          className={`w-[340px] shrink-0 flex flex-col gap-4 rounded-2xl transition-all ${
            dragOverColumn === 'todo' ? 'ring-2 ring-[#FF6B4D] bg-orange-50/40' : ''
          }`}
        >
          {/* Sticky Header (z-10) */}
          <div className="flex justify-between items-center px-2 py-2.5 sticky top-0 bg-[#F8F9FA] z-10 border-b border-gray-200/80 rounded-t-xl">
            <h3 className="font-semibold text-[15px] flex items-center text-gray-900">
              Started (To Do) 
              <span className="text-gray-400 font-normal ml-1.5 text-[13px]">{todoTasks.length}</span>
            </h3>
            {!isClient && (
              <button 
                className="text-gray-400 hover:text-[#FF6B4D] text-lg font-medium transition-colors p-1 cursor-pointer" 
                aria-label="Add task to Started"
              >
                +
              </button>
            )}
          </div>
          
          <div className="space-y-4 min-h-[150px]">
            {todoTasks.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-[20px] h-[130px] flex flex-col items-center justify-center text-gray-400 text-sm font-medium bg-gray-50/50">
                <Clock className="w-5 h-5 mb-1.5 text-gray-300" />
                Geser task ke sini (Started)
              </div>
            ) : (
              todoTasks.map(node => (
                <HTMLKanbanCard 
                  key={node.id} 
                  node={node} 
                  developers={developers}
                  isPM={isPM}
                  isClient={isClient}
                  onMove={(st) => setTaskStatus(node.id, st)}
                  onAssign={(dev) => assignDeveloper(node.id, dev)}
                  onOpenDetail={() => setSelectedTaskId(node.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 2: On Going (In Progress) */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragOverColumn('in_progress'); }}
          onDragLeave={() => setDragOverColumn(null)}
          onDrop={(e) => handleDrop(e, 'in_progress')}
          className={`w-[340px] shrink-0 flex flex-col gap-4 rounded-2xl transition-all ${
            dragOverColumn === 'in_progress' ? 'ring-2 ring-orange-500 bg-orange-50/40' : ''
          }`}
        >
          {/* Sticky Header (z-10) */}
          <div className="flex justify-between items-center px-2 py-2.5 sticky top-0 bg-[#F8F9FA] z-10 border-b border-gray-200/80 rounded-t-xl">
            <h3 className="font-semibold text-[15px] flex items-center text-[#EA580C]">
              On Going 
              <span className="text-orange-400 font-normal ml-1.5 text-[13px]">{inProgressTasks.length}</span>
            </h3>
            {!isClient && (
              <button 
                className="text-gray-400 hover:text-[#FF6B4D] text-lg font-medium transition-colors p-1 cursor-pointer" 
                aria-label="Add task to On Going"
              >
                +
              </button>
            )}
          </div>
          
          <div className="space-y-4 min-h-[150px]">
            {inProgressTasks.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-[20px] h-[130px] flex flex-col items-center justify-center text-gray-400 text-sm font-medium bg-gray-50/50">
                <PlayCircle className="w-5 h-5 mb-1.5 text-gray-300" />
                Geser task ke sini (On Going)
              </div>
            ) : (
              inProgressTasks.map(node => (
                <HTMLKanbanCard 
                  key={node.id} 
                  node={node} 
                  developers={developers}
                  isPM={isPM}
                  isClient={isClient}
                  onMove={(st) => setTaskStatus(node.id, st)}
                  onAssign={(dev) => assignDeveloper(node.id, dev)}
                  onOpenDetail={() => setSelectedTaskId(node.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 3: Review Klien */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragOverColumn('review'); }}
          onDragLeave={() => setDragOverColumn(null)}
          onDrop={(e) => handleDrop(e, 'review')}
          className={`w-[340px] shrink-0 flex flex-col gap-4 rounded-2xl transition-all ${
            dragOverColumn === 'review' ? 'ring-2 ring-blue-500 bg-blue-50/40' : ''
          }`}
        >
          {/* Sticky Header (z-10) */}
          <div className="flex justify-between items-center px-2 py-2.5 sticky top-0 bg-[#F8F9FA] z-10 border-b border-gray-200/80 rounded-t-xl">
            <h3 className="font-semibold text-[15px] flex items-center text-blue-700">
              Review Klien 
              <span className="text-blue-400 font-normal ml-1.5 text-[13px]">{reviewTasks.length}</span>
            </h3>
            {!isClient && (
              <button 
                className="text-gray-400 hover:text-[#FF6B4D] text-lg font-medium transition-colors p-1 cursor-pointer" 
                aria-label="Add task to Review Klien"
              >
                +
              </button>
            )}
          </div>
          
          <div className="space-y-4 min-h-[150px]">
            {reviewTasks.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-[20px] h-[130px] flex flex-col items-center justify-center text-gray-400 text-sm font-medium bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <MessageSquare className="w-5 h-5 mb-1.5 text-gray-300" />
                Geser task ke sini (Review)
              </div>
            ) : (
              reviewTasks.map(node => (
                <HTMLKanbanCard 
                  key={node.id} 
                  node={node} 
                  developers={developers}
                  isPM={isPM}
                  isClient={isClient}
                  onMove={(st) => setTaskStatus(node.id, st)}
                  onAssign={(dev) => assignDeveloper(node.id, dev)}
                  onOpenDetail={() => setSelectedTaskId(node.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 4: Completed (Done) */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragOverColumn('done'); }}
          onDragLeave={() => setDragOverColumn(null)}
          onDrop={(e) => handleDrop(e, 'done')}
          className={`w-[340px] shrink-0 flex flex-col gap-4 rounded-2xl transition-all ${
            dragOverColumn === 'done' ? 'ring-2 ring-emerald-500 bg-emerald-50/40' : ''
          }`}
        >
          {/* Sticky Header (z-10) */}
          <div className="flex justify-between items-center px-2 py-2.5 sticky top-0 bg-[#F8F9FA] z-10 border-b border-gray-200/80 rounded-t-xl">
            <h3 className="font-semibold text-[15px] flex items-center text-emerald-700">
              Completed 
              <span className="text-emerald-400 font-normal ml-1.5 text-[13px]">{doneTasks.length}</span>
            </h3>
            {!isClient && (
              <button 
                className="text-gray-400 hover:text-[#FF6B4D] text-lg font-medium transition-colors p-1 cursor-pointer" 
                aria-label="Add task to Completed"
              >
                +
              </button>
            )}
          </div>
          
          <div className="space-y-4 min-h-[150px]">
            {doneTasks.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-[20px] h-[130px] flex flex-col items-center justify-center text-gray-400 text-sm font-medium bg-gray-50/50">
                <CheckCircle2 className="w-5 h-5 mb-1.5 text-gray-300" />
                Geser task ke sini (Completed)
              </div>
            ) : (
              doneTasks.map(node => (
                <HTMLKanbanCard 
                  key={node.id} 
                  node={node} 
                  developers={developers}
                  isPM={isPM}
                  isClient={isClient}
                  onMove={(st) => setTaskStatus(node.id, st)}
                  onAssign={(dev) => assignDeveloper(node.id, dev)}
                  onOpenDetail={() => setSelectedTaskId(node.id)}
                />
              ))
            )}
          </div>
        </div>

      </div>

      {/* Task Detail Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-[110] animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {selectedNode.type === 'featureNode' ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF2F0] text-[#EA580C] border border-orange-200 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="w-3 h-3" /> FITUR UTAMA
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider flex items-center gap-1">
                      <Component className="w-3 h-3" /> SUB FITUR
                    </span>
                  )}
                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedNode.data.phase || 'FASE 1'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{selectedNode.data.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedTaskId(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-bold text-gray-900 mb-1">User Story / Deskripsi:</p>
                <p className="bg-gray-50 p-3 rounded-xl border border-gray-200/70 text-gray-700">
                  {selectedNode.data.userStory || selectedNode.data.goals || 'Belum ada spesifikasi user story.'}
                </p>
              </div>

              {selectedNode.type === 'subfeatureNode' && selectedNode.data.items && selectedNode.data.items.length > 0 && (
                <div>
                  <p className="font-bold text-gray-900 mb-1.5">Daftar Item Sub-Fitur:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.data.items.map((item: string, idx: number) => (
                      <span key={idx} className="bg-blue-50 text-blue-800 text-[11px] font-medium px-2.5 py-1 rounded-full border border-blue-100">
                        • {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="font-bold text-gray-900 mb-1">Acceptance Criteria:</p>
                <p className="bg-gray-50 p-3 rounded-xl border border-gray-200/70 text-gray-700 whitespace-pre-line">
                  {selectedNode.data.acceptanceCriteria || '1. Modul berfungsi sesuai alur.\n2. Lolos pengujian tim QA.'}
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-1">Developer Penanggung Jawab:</p>
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center border border-orange-200">
                      {selectedNode.data.assignedDevName ? selectedNode.data.assignedDevName.charAt(0) : '?'}
                    </div>
                    <div>
                      <p className="font-bold text-blue-900">{selectedNode.data.assignedDevName || 'Belum Ditentukan (Unassigned)'}</p>
                      {selectedNode.data.assignedDevEmail && <p className="text-[10px] text-blue-700">{selectedNode.data.assignedDevEmail}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {!isClient && (
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <p className="font-bold text-gray-900">Ubah Status Pengerjaan:</p>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => { setTaskStatus(selectedNode.id, 'todo'); setSelectedTaskId(null); }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${getTaskStatus(selectedNode) === 'todo' ? 'bg-gray-900 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                    >
                      Started
                    </button>
                    <button
                      onClick={() => { setTaskStatus(selectedNode.id, 'in_progress'); setSelectedTaskId(null); }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${getTaskStatus(selectedNode) === 'in_progress' ? 'bg-[#FF6B4D] text-white' : 'bg-orange-50 hover:bg-orange-100 text-[#EA580C]'}`}
                    >
                      On Going
                    </button>
                    <button
                      onClick={() => { setTaskStatus(selectedNode.id, 'review'); setSelectedTaskId(null); }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${getTaskStatus(selectedNode) === 'review' ? 'bg-amber-600 text-white' : 'bg-amber-50 hover:bg-amber-100 text-amber-700'}`}
                    >
                      Review Klien
                    </button>
                    <button
                      onClick={() => { setTaskStatus(selectedNode.id, 'done'); setSelectedTaskId(null); }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${getTaskStatus(selectedNode) === 'done' ? 'bg-green-600 text-white' : 'bg-green-50 hover:bg-green-100 text-green-700'}`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTaskId(null)}
                className="px-5 py-2.5 bg-[#FF6B4D] hover:bg-[#e65a3d] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-sm transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Kanban Card Component supporting HTML5 Drag-and-Drop Card Movement
function HTMLKanbanCard({
  node,
  developers,
  isPM,
  isClient,
  onMove,
  onAssign,
  onOpenDetail,
}: {
  node: any;
  developers: UserAccount[];
  isPM: boolean;
  isClient: boolean;
  onMove: (st: TaskStatus) => void;
  onAssign: (dev: UserAccount | null) => void;
  onOpenDetail: () => void;
}) {
  const [isOpenAssignMenu, setIsOpenAssignMenu] = useState(false);
  const assignRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (assignRef.current && !assignRef.current.contains(event.target as Node)) {
        setIsOpenAssignMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStatus = (node.data.taskStatus as TaskStatus) || 'todo';
  const assignedName = node.data.assignedDevName;
  const isFeature = node.type === 'featureNode';

  // Calculate Progress Percentage
  const getProgressPercentage = (st: TaskStatus) => {
    if (st === 'todo') return 0;
    if (st === 'in_progress') return 60;
    if (st === 'review') return 85;
    return 100;
  };

  const progress = getProgressPercentage(currentStatus);

  const getProgressTextColor = () => {
    if (progress === 100) return 'text-green-500';
    if (progress > 0) return 'text-[#FF6B4D]';
    return 'text-gray-500';
  };

  const getProgressBarFill = () => {
    if (progress === 100) return 'bg-green-500';
    if (progress > 0) return 'bg-[#FF6B4D]';
    return 'bg-gray-300';
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (isClient) return;
    e.dataTransfer.setData('taskId', node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      draggable={!isClient}
      onDragStart={handleDragStart}
      className={`bg-white rounded-[20px] p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 cursor-grab active:cursor-grabbing border border-transparent hover:border-orange-100 flex flex-col min-h-[210px] select-none ${
        currentStatus === 'done' ? 'opacity-[0.88] hover:opacity-100' : ''
      }`}
    >
      
      {/* Header Row: Type Distinction Badge + Options */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5">
          {/* Main Feature vs Sub Feature Badge Distinction */}
          {isFeature ? (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF2F0] text-[#EA580C] border border-orange-200 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3" /> FITUR UTAMA
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider flex items-center gap-1">
              <Component className="w-3 h-3" /> SUB FITUR
            </span>
          )}

          {node.data.phase && (
            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {node.data.phase}
            </span>
          )}
        </div>

        {/* Options / Detail Trigger */}
        <button 
          type="button" 
          onClick={onOpenDetail}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-bold tracking-widest px-1 cursor-pointer"
          title="Opsi Detail"
        >
          •••
        </button>
      </div>

      {/* Content Body */}
      <div onClick={onOpenDetail} className="mb-3 space-y-1.5 cursor-pointer">
        <h4 className="font-semibold text-[15px] leading-tight text-gray-900 hover:text-[#FF6B4D] transition-colors">
          {node.data.title}
        </h4>
        <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
          {node.data.userStory || node.data.goals || 'Wireframing, mockups, clients collaboration'}
        </p>

        {/* Sub-feature Pills Preview if type === 'subfeatureNode' */}
        {!isFeature && node.data.items && node.data.items.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {node.data.items.slice(0, 2).map((item: string, idx: number) => (
              <span key={idx} className="text-[10px] font-medium text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 truncate max-w-[130px]">
                • {item}
              </span>
            ))}
            {node.data.items.length > 2 && (
              <span className="text-[10px] font-medium text-gray-400">+{node.data.items.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar Section matching HTML reference */}
      <div onClick={onOpenDetail} className="mb-4 mt-auto cursor-pointer">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] font-medium text-gray-400">Progress</span>
          <span className={`text-[11px] font-semibold ${getProgressTextColor()}`}>{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressBarFill()} rounded-full transition-all duration-300`} 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer Section: Avatars & Metrics */}
      <div className="flex justify-between items-center border-t border-gray-50 pt-3 relative">
        
        {/* Avatar Stack / Developer Assignment matching Reference */}
        <div className="relative flex items-center gap-2" ref={assignRef}>
          {assignedName ? (
            <div 
              onClick={() => isPM && setIsOpenAssignMenu(!isOpenAssignMenu)}
              className="flex items-center gap-2 cursor-pointer group/avatar"
              title={isPM ? 'Klik untuk ganti developer' : `Ditugaskan ke ${assignedName}`}
            >
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-tr from-[#FF6B4D] to-amber-400 text-white font-bold text-[10px] flex items-center justify-center shadow-2xs shrink-0">
                  {assignedName.charAt(0)}
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-700 truncate max-w-[100px] group-hover/avatar:text-[#FF6B4D] transition-colors">
                {assignedName}
              </span>
            </div>
          ) : (
            isPM ? (
              <div
                onClick={() => setIsOpenAssignMenu(!isOpenAssignMenu)}
                className="flex items-center gap-1.5 cursor-pointer group/assign"
                title="Tugaskan Developer"
              >
                <div className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-[#FF6B4D] hover:text-[#FF6B4D] hover:bg-orange-50 font-bold text-xs flex items-center justify-center transition-all">
                  +
                </div>
                <span className="text-xs text-gray-400 font-medium group-hover/assign:text-[#FF6B4D] transition-colors">
                  Assign Dev
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">Unassigned</span>
            )
          )}

          {/* PM Developer Dropdown */}
          {isOpenAssignMenu && isPM && (
            <div className="absolute left-0 bottom-full mb-2 w-52 bg-white rounded-2xl border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-2 z-50 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-2 py-1 border-b border-gray-100 mb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pilih Developer</p>
              </div>

              {developers.map((dev) => (
                <button
                  key={dev.id}
                  type="button"
                  onClick={() => {
                    onAssign(dev);
                    setIsOpenAssignMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                    assignedName === dev.name ? 'bg-orange-50 text-[#FF6B4D] font-bold border border-orange-200' : 'hover:bg-gray-50 text-[#0A0A0A]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-[#FF6B4D] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                      {dev.name.charAt(0)}
                    </div>
                    <span className="text-xs truncate">{dev.name}</span>
                  </div>
                  {assignedName === dev.name && <Check className="w-3.5 h-3.5 text-[#FF6B4D]" />}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  onAssign(null);
                  setIsOpenAssignMenu(false);
                }}
                className="w-full text-center text-[10px] text-red-600 hover:bg-red-50 p-1.5 rounded-lg font-bold transition-colors cursor-pointer border-t border-gray-100 mt-1"
              >
                Unassign
              </button>
            </div>
          )}
        </div>

        {/* Metrics Counter Icons matching HTML reference */}
        <div onClick={onOpenDetail} className="flex gap-3 text-gray-400 text-xs font-medium cursor-pointer">
          <span className="flex items-center gap-1 hover:text-gray-600 transition-colors" title="2 Lampiran">
            <Paperclip className="w-3.5 h-3.5" /> 2
          </span>
          <span className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors" title="4 Feedback">
            <MessageSquare className="w-3.5 h-3.5" /> 4
          </span>
        </div>

      </div>

    </div>
  );
}
