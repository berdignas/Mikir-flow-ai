'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useFlowContext } from '@/context/FlowContext';
import NodeIcon from '@/utils/getDynamicIcon';

function SubfeatureNode({ id, data }: { id: string; data: any }) {
  const { activeNodeId, setActiveNodeId } = useFlowContext();
  const isActive = activeNodeId === id;

  return (
    <div 
      onClick={() => setActiveNodeId(id)}
      className={`relative flex w-64 flex-col rounded-[12px] border bg-[var(--color-surface)] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all cursor-pointer ${
        isActive 
          ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20 z-10 scale-[1.02]' 
          : 'border-[var(--color-border)] hover:border-gray-300'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white" />
      
      {/* Category Header Label according to design.md rules (All-Caps + Positive Letter-Spacing 0.05em + 10px) */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-3">
        <NodeIcon title={data.title} type="subfeature" className="h-4 w-4 text-gray-400 shrink-0" />
        <span className="font-label-sm truncate">
          {data.title || "SUB FITUR"}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {data.items?.map((item: string, i: number) => (
          <div key={i} className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-xs text-gray-700 border border-gray-100">
             <div className="h-1.5 w-1.5 rounded-full bg-gray-300 shrink-0"></div>
             <span className="truncate">{item}</span>
          </div>
        ))}
      </div>
      
      {data.items?.length > 3 && (
        <div className="mt-3 text-right">
          <span className="text-[10px] text-gray-400 font-medium hover:text-gray-600">Lihat semua ({data.items.length}) &gt;</span>
        </div>
      )}
      
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white" />
    </div>
  );
}

export default memo(SubfeatureNode);
