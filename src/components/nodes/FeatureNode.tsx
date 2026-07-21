'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useFlowContext } from '@/context/FlowContext';
import NodeIcon from '@/utils/getDynamicIcon';

function FeatureNode({ id, data }: { id: string; data: any }) {
  const { activeNodeId, setActiveNodeId } = useFlowContext();
  const isActive = activeNodeId === id;

  return (
    <div 
      onClick={() => setActiveNodeId(id)}
      className={`relative flex w-64 items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition-all cursor-pointer ${
        isActive 
          ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20 z-10 scale-[1.02]' 
          : 'border-[var(--color-border)] hover:border-gray-300'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-orange-400 !border-2 !border-white" />
      
      {/* Badge */}
      {data.phase && (
        <div className="absolute -top-3 -right-1">
          <span className="text-[9px] font-bold tracking-wider text-[var(--color-badge-orange-text)] bg-[var(--color-badge-orange-bg)] px-2 py-0.5 rounded-full border border-orange-200 shadow-2xs">
            {data.phase}
          </span>
        </div>
      )}

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 shrink-0">
        <NodeIcon title={data.title} type="feature" className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1">{data.title}</h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
          {data.subtitle}
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-orange-400 !border-2 !border-white" />
    </div>
  );
}

export default memo(FeatureNode);
