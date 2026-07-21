'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useFlowContext } from '@/context/FlowContext';
import NodeIcon from '@/utils/getDynamicIcon';

function RootNode({ id, data }: { id: string; data: any }) {
  const { activeNodeId, setActiveNodeId } = useFlowContext();
  const isActive = activeNodeId === id;

  return (
    <div 
      onClick={() => setActiveNodeId(id)}
      className={`relative flex w-56 items-center gap-3 rounded-xl border bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all cursor-pointer ${
        isActive 
          ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20 z-10 scale-[1.02]' 
          : 'border-[var(--color-border)] hover:border-gray-300'
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-[var(--color-primary)] shrink-0">
        <NodeIcon title={data.title} type="root" className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{data.title}</h3>
        {data.subtitle && <p className="text-xs text-gray-500">{data.subtitle}</p>}
      </div>
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-orange-500 !border-2 !border-white" />
    </div>
  );
}

export default memo(RootNode);
