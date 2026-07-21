'use client';

import { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from '@xyflow/react';
import { useFlowContext } from '@/context/FlowContext';

export default function DeletableEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { deleteEdge, nodes } = useFlowContext();
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Determine flow color based on target node type
  const targetNode = nodes.find((n) => n.id === target);
  let flowColor = '#FF6B4D'; // Default coral/orange for Feature
  if (targetNode?.type === 'subfeatureNode') {
    flowColor = '#3B82F6'; // Blue for Sub-feature
  } else if (targetNode?.type === 'rootNode') {
    flowColor = '#D97706'; // Amber for Root
  }

  return (
    <g 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <style jsx>{`
        @keyframes n8n-flow {
          from {
            stroke-dashoffset: 20;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .n8n-animated-edge {
          stroke-dasharray: 5, 5;
          animation: n8n-flow 1.2s linear infinite;
        }
      `}</style>

      {/* Invisible wider path to make hover interaction easy */}
      <path 
        d={edgePath} 
        fill="none" 
        stroke="transparent" 
        strokeWidth={25} 
        className="cursor-pointer" 
      />

      {/* Base subtle background edge line */}
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          stroke: isHovered ? '#EF4444' : '#E2E8F0',
          strokeWidth: isHovered ? 2.5 : 1.5,
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
        }} 
      />

      {/* n8n-style Animated Flow Overlay Path (Thin & Semi-transparent) */}
      {!isHovered && (
        <path
          d={edgePath}
          fill="none"
          stroke={flowColor}
          strokeWidth={1.5}
          strokeOpacity={0.65}
          className="n8n-animated-edge pointer-events-none"
        />
      )}

      {/* Delete button on hover */}
      {isHovered && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              onClick={(event) => {
                event.stopPropagation();
                deleteEdge(id);
              }}
              className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all hover:scale-110 text-xs font-bold"
              title="Hapus Garis"
            >
              ✕
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </g>
  );
}
