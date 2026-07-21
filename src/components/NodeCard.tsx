'use client';

import { Handle, Position } from '@xyflow/react';

export default function NodeCard({ title, phase, active, unread, approved }: { title: string, phase?: string, active?: boolean, unread?: number, approved?: boolean }) {
  return (
    <div className={`relative flex w-64 flex-col gap-2 rounded-xl border bg-[var(--color-surface)] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all ${active ? 'border-[var(--color-primary)] shadow-[0_0_10px_rgba(255,107,77,0.15)] z-10' : 'border-[var(--color-border)] hover:border-gray-300'}`}>
      <Handle type="target" position={Position.Left} style={{ background: 'transparent', border: 'none' }} />
      <Handle type="source" position={Position.Right} style={{ background: 'transparent', border: 'none' }} />
      
      {/* Badges container */}
      <div className="absolute -top-3 -right-3 flex gap-1 z-20">
        {unread && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-error)] text-[10px] font-bold text-white shadow-sm">
            {unread}
          </div>
        )}
        {approved && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-success)] text-white shadow-sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between">
        <span className="text-[10px] font-semibold tracking-wider text-[var(--color-badge-orange-text)] bg-[var(--color-badge-orange-bg)] px-2 py-0.5 rounded-full uppercase">
          {phase || "SUB FITUR"}
        </span>
      </div>
      
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mt-1">{title}</h3>
    </div>
  );
}
