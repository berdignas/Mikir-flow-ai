'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, addEdge, Connection } from '@xyflow/react';
import dagre from 'dagre';
import { projectService } from '@/services/projectService';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export type NodeData = {
  title?: string;
  phase?: string;
  subtitle?: string;
  items?: string[];
  // PRD & Task Data
  userStory?: string;
  acceptanceCriteria?: string;
  tasks?: string[];
  comments?: { user: string; text: string; time: string }[];
  [key: string]: any;
};

export interface ProjectItem {
  id: string;
  title: string;
  client_name: string;
  prd_text?: string;
}

interface FlowContextType {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node<NodeData>) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  loadNodesFromPRD: (prdText: string) => void;
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;
  autoLayout: () => void;
  isDbConnected: boolean;

  // Project Management Extensions
  projectsList: ProjectItem[];
  activeProjectId: string;
  activeProject: ProjectItem | undefined;
  setActiveProjectId: (id: string) => void;
  createNewProject: (title: string, clientName: string, prdText?: string) => Promise<string>;
  deleteProject: (id: string) => Promise<void>;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

const DUMMY_PROJECT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

const initialProjects: ProjectItem[] = [
  {
    id: DUMMY_PROJECT_ID,
    title: 'E-Commerce Marketplace Platform',
    client_name: 'PT Javas',
    prd_text: 'Judul: E-Commerce Marketplace Platform\n1. Fitur Utama: Autentikasi Pengguna\n2. Fitur Utama: Payment & Checkout',
  },
  {
    id: 'p-pos-002',
    title: 'Smart POS & Inventory System',
    client_name: 'PT Nusantara Tech',
    prd_text: 'Judul: Smart POS & Inventory System\n1. Fitur Utama: Manajemen Kasir\n2. Fitur Utama: Stok Opname',
  },
  {
    id: 'p-mbank-003',
    title: 'Mobile Banking SuperApp',
    client_name: 'Bank Berdikari',
    prd_text: 'Judul: Mobile Banking SuperApp\n1. Fitur Utama: Transfer BI-Fast\n2. Fitur Utama: QRIS Merchant',
  },
];

// Initial mock data
const initialNodes: Node<NodeData>[] = [
  { id: 'root', type: 'rootNode', position: { x: 0, y: 0 }, data: { title: 'Mikir flow ai', subtitle: 'Perencanaan' } },
  { id: 'f1', type: 'featureNode', position: { x: 0, y: 0 }, data: { title: 'Papan Diagram Interaktif', phase: 'FASE 1', status: 'Selesai', subtitle: 'Direncanakan', userStory: 'Sebagai user, saya bisa mengatur tata letak diagram dengan mudah.' } },
  { id: 's1', type: 'subfeatureNode', position: { x: 0, y: 0 }, data: { title: 'SUB FITUR', items: ['Seret & Hubungkan Fitur', 'Zoom & Geser Kanvas', 'Beberapa Halaman Diagram'] } },
  { id: 'f2', type: 'featureNode', position: { x: 0, y: 0 }, data: { title: 'Koleksi Fitur & Detail', phase: 'FASE 1', status: 'Selesai', subtitle: 'Direncanakan' } },
  { id: 's2', type: 'subfeatureNode', position: { x: 0, y: 0 }, data: { title: 'SUB FITUR', items: ['Tambah Fitur Baru', 'Panel Detail Fitur'] } },
  { id: 'f3', type: 'featureNode', position: { x: 0, y: 0 }, data: { title: 'Galeri Proyek', phase: 'FASE 1', status: 'Selesai', subtitle: 'Direncanakan' } },
  { id: 's3', type: 'subfeatureNode', position: { x: 0, y: 0 }, data: { title: 'SUB FITUR', items: ['Daftar Semua Proyek', 'Cari & Filter Proyek', 'Buat Proyek Baru'] } },
];

const initialEdges: Edge[] = [
  { id: 'e-root-f1', source: 'root', target: 'f1', type: 'deletableEdge', style: { stroke: '#A1A1AA', strokeWidth: 1.5 } },
  { id: 'e-root-f2', source: 'root', target: 'f2', type: 'deletableEdge', style: { stroke: '#A1A1AA', strokeWidth: 1.5 } },
  { id: 'e-root-f3', source: 'root', target: 'f3', type: 'deletableEdge', style: { stroke: '#A1A1AA', strokeWidth: 1.5 } },
  { id: 'e-f1-s1', source: 'f1', target: 's1', type: 'deletableEdge', style: { stroke: '#A1A1AA', strokeWidth: 1.5 } },
  { id: 'e-f2-s2', source: 'f2', target: 's2', type: 'deletableEdge', style: { stroke: '#A1A1AA', strokeWidth: 1.5 } },
  { id: 'e-f3-s3', source: 'f3', target: 's3', type: 'deletableEdge', style: { stroke: '#A1A1AA', strokeWidth: 1.5 } },
];

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>(DUMMY_PROJECT_ID);

  const [nodes, setNodes] = useState<Node<NodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  const activeProject = projectsList.find((p) => p.id === activeProjectId) || projectsList[0];

  // Fetch projects list & active project flow
  useEffect(() => {
    async function initSupabaseData() {
      if (isSupabaseConfigured()) {
        setIsDbConnected(true);
        const fetchedProjects = await projectService.fetchProjects();
        if (fetchedProjects && fetchedProjects.length > 0) {
          setProjectsList(fetchedProjects);
        }

        const dbFlow = await projectService.getProjectFlow(activeProjectId);
        if (dbFlow && dbFlow.nodes && dbFlow.nodes.length > 0) {
          const loadedNodes: Node<NodeData>[] = dbFlow.nodes.map((n: any) => ({
            id: n.id,
            type: n.type,
            position: { x: n.position_x, y: n.position_y },
            data: {
              title: n.title,
              subtitle: n.subtitle,
              phase: n.phase,
              status: n.status,
              goals: n.goals,
              userStory: n.user_story,
              acceptanceCriteria: n.acceptance_criteria,
              dependencies: n.dependencies,
              items: n.items || [],
            },
          }));

          const loadedEdges: Edge[] = dbFlow.edges.map((e: any) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            type: e.type || 'deletableEdge',
            style: { stroke: '#A1A1AA', strokeWidth: 1.5 },
          }));

          setNodes(loadedNodes);
          setEdges(loadedEdges);
        }
      }
    }
    initSupabaseData();
  }, [activeProjectId]);

  const autoLayout = useCallback(() => {
    setNodes((nds) => {
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));
      dagreGraph.setGraph({ rankdir: 'LR', ranksep: 100, nodesep: 40 });

      nds.forEach((node) => {
        let width = 280;
        let height = 80;
        if (node.type === 'subfeatureNode') height = 150;
        dagreGraph.setNode(node.id, { width, height });
      });

      edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      return nds.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        if (!nodeWithPosition) return node;
        return {
          ...node,
          position: {
            x: nodeWithPosition.x - (nodeWithPosition.width / 2),
            y: nodeWithPosition.y - (nodeWithPosition.height / 2),
          },
        };
      });
    });
  }, [edges]);

  // Run initial layout
  useEffect(() => {
    if (nodes.length > 0 && nodes[0].position.x === 0 && nodes[0].position.y === 0) {
      autoLayout();
    }
  }, [nodes, autoLayout]);

  const loadNodesFromPRD = useCallback((prdText: string) => {
    if (!prdText || !prdText.trim()) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const lines = prdText.split('\n');
    let title = 'Smart Application Flow';
    const parsedFeatures: { title: string; items: string[] }[] = [];

    let currentFeature: { title: string; items: string[] } | null = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().startsWith('judul:')) {
        title = trimmed.replace(/judul:/i, '').trim();
      } else if (/^\d+\.\s*fitur/i.test(trimmed) || /^\d+\.\s*/.test(trimmed)) {
        if (currentFeature) parsedFeatures.push(currentFeature);
        currentFeature = {
          title: trimmed.replace(/^\d+\.\s*(fitur utama:)?\s*/i, '').trim(),
          items: [],
        };
      } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        if (currentFeature) {
          currentFeature.items.push(trimmed.replace(/^[-*]\s*/, '').trim());
        }
      }
    });

    if (currentFeature) parsedFeatures.push(currentFeature);

    const newNodes: Node<NodeData>[] = [];
    const newEdges: Edge[] = [];

    const rootId = 'root';
    newNodes.push({
      id: rootId,
      type: 'rootNode',
      position: { x: 0, y: 0 },
      data: { title, subtitle: 'Perencanaan Workspace' },
    });

    parsedFeatures.forEach((feat, idx) => {
      const featId = `f_${idx + 1}`;
      newNodes.push({
        id: featId,
        type: 'featureNode',
        position: { x: 0, y: 0 },
        data: {
          title: feat.title,
          phase: `FASE ${idx + 1}`,
          status: 'Selesai',
          subtitle: 'Direncanakan',
          goals: `Mengembangkan modul ${feat.title} untuk aplikasi`,
          userStory: `Sebagai pengguna, saya ingin bisa menggunakan fitur ${feat.title} dengan cepat.`,
        },
      });

      newEdges.push({
        id: `e-root-${featId}`,
        source: rootId,
        target: featId,
        type: 'deletableEdge',
        style: { stroke: '#A1A1AA', strokeWidth: 1.5 },
      });

      if (feat.items.length > 0) {
        const subId = `s_${idx + 1}`;
        newNodes.push({
          id: subId,
          type: 'subfeatureNode',
          position: { x: 0, y: 0 },
          data: {
            title: `SUB FITUR ${feat.title.toUpperCase()}`,
            items: feat.items,
          },
        });

        newEdges.push({
          id: `e-${featId}-${subId}`,
          source: featId,
          target: subId,
          type: 'deletableEdge',
          style: { stroke: '#A1A1AA', strokeWidth: 1.5 },
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);

    setTimeout(() => {
      autoLayout();
    }, 100);
  }, [autoLayout]);

  const createNewProject = async (title: string, clientName: string, prdText?: string): Promise<string> => {
    let realProjectId = `p-${Date.now()}`;
    if (isSupabaseConfigured()) {
      const created = await projectService.createProject(title, clientName, prdText || '');
      if (created && created.id) {
        realProjectId = created.id;
      }
    }

    const newProj: ProjectItem = {
      id: realProjectId,
      title,
      client_name: clientName,
      prd_text: prdText || '',
    };

    setProjectsList((prev) => [newProj, ...prev]);
    setActiveProjectId(realProjectId);

    // Make canvas 100% EMPTY for new project!
    setNodes([]);
    setEdges([]);

    return realProjectId;
  };

  const deleteProject = async (projectId: string) => {
    setProjectsList((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      // If deleted active project, switch to first project
      if (activeProjectId === projectId && updated.length > 0) {
        setActiveProjectId(updated[0].id);
      }
      return updated;
    });

    if (isSupabaseConfigured()) {
      await projectService.deleteProject(projectId);
    }
  };

  const addNode = useCallback((node: Node<NodeData>) => {
    setNodes((nds) => [...nds, node]);
  }, []);

  const updateNodeData = useCallback((id: string, data: Partial<NodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...data },
          };
        }
        return node;
      })
    );
  }, []);

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, []);

  const deleteEdge = useCallback((id: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, type: 'deletableEdge', style: { stroke: '#A1A1AA', strokeWidth: 1.5 } }, eds)),
    []
  );

  return (
    <FlowContext.Provider
      value={{
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        updateNodeData,
        deleteNode,
        deleteEdge,
        loadNodesFromPRD,
        activeNodeId,
        setActiveNodeId,
        autoLayout,
        isDbConnected,
        projectsList,
        activeProjectId,
        activeProject,
        setActiveProjectId,
        createNewProject,
        deleteProject,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export const useFlowContext = () => {
  const context = useContext(FlowContext);
  if (!context) throw new Error('useFlowContext must be used within FlowProvider');
  return context;
};
