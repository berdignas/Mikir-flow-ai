'use client';

import React from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFlowContext } from '@/context/FlowContext';
import { useAuthContext } from '@/context/AuthContext';
import RootNode from './nodes/RootNode';
import FeatureNode from './nodes/FeatureNode';
import SubfeatureNode from './nodes/SubfeatureNode';
import DeletableEdge from './edges/DeletableEdge';
import { Eye } from 'lucide-react';

const nodeTypes = {
  rootNode: RootNode,
  featureNode: FeatureNode,
  subfeatureNode: SubfeatureNode,
};

const edgeTypes = {
  deletableEdge: DeletableEdge,
};

export default function FlowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, autoLayout, addNode, setActiveNodeId } = useFlowContext();
  const { currentUser } = useAuthContext();

  const isClient = currentUser?.role === 'client';

  const handleAddRoot = () => {
    if (isClient) return;
    const id = `r${Date.now()}`;
    addNode({
      id,
      type: 'rootNode',
      position: { x: 0, y: 0 },
      data: { title: 'Modul Utama', subtitle: 'Perencanaan' }
    });
    setTimeout(autoLayout, 50);
  };

  const handleAddFeature = () => {
    if (isClient) return;
    const id = `f${Date.now()}`;
    addNode({
      id,
      type: 'featureNode',
      position: { x: 0, y: 0 },
      data: { title: 'Fitur Baru', phase: 'FASE 1', subtitle: 'Direncanakan' }
    });
    setTimeout(autoLayout, 50);
  };

  const handleAddSubfeature = () => {
    if (isClient) return;
    const id = `s${Date.now()}`;
    addNode({
      id,
      type: 'subfeatureNode',
      position: { x: 0, y: 0 },
      data: { title: 'SUB FITUR', items: ['Item 1', 'Item 2'] }
    });
    setTimeout(autoLayout, 50);
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={isClient ? undefined : onNodesChange}
        onEdgesChange={isClient ? undefined : onEdgesChange}
        onConnect={isClient ? undefined : onConnect}
        onNodeClick={(_, node) => setActiveNodeId(node.id)}
        onPaneClick={() => setActiveNodeId(null)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#E5E7EB" />
        <Controls />
        <Panel position="top-left" className="bg-white p-2 rounded-xl shadow-md border border-gray-200 m-4 flex items-center gap-2">
          <button 
            onClick={autoLayout}
            className="px-3 py-1.5 text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-700"
          >
            Rapihkan Layout (Auto)
          </button>

          {isClient ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg border border-amber-200">
              <Eye className="w-3.5 h-3.5" /> Mode Klien (Read-Only)
            </div>
          ) : (
            <>
              <button 
                onClick={handleAddRoot}
                className="px-3 py-1.5 text-xs font-medium bg-amber-600 text-white rounded-lg hover:brightness-110 cursor-pointer shadow-xs"
              >
                + Root Node
              </button>
              <button 
                onClick={handleAddFeature}
                className="px-3 py-1.5 text-xs font-medium bg-[var(--color-primary)] text-white rounded-lg hover:brightness-110 cursor-pointer shadow-xs"
              >
                + Fitur Utama
              </button>
              <button 
                onClick={handleAddSubfeature}
                className="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-lg hover:brightness-110 cursor-pointer shadow-xs"
              >
                + Sub-Fitur
              </button>
            </>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
}
