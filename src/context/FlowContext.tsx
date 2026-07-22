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

export interface ProjectFlowData {
  nodes: Node<NodeData>[];
  edges: Edge[];
  prdText?: string;
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
  updateActiveProjectPRD: (prdText: string) => void;
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

const samplePRD_A = `# ROOT NODE: E-Commerce Marketplace Platform
**Tujuan Utama:** Platform transaksi jual-beli online terintegrasi dengan sistem pembayaran otomatis dan manajemen pengiriman paket.

## FEATURE: Manajemen Akun & Autentikasi (Badge: FASE 1)
**Deskripsi Modul:** Modul autentikasi pengguna multi-role untuk pembeli dan penjual.

### SUB-FEATURE: Login & Register Multi-Role
- **User Story:** Sebagai pengguna, saya ingin login dengan email & OTP WhatsApp agar akun saya aman.
- **Acceptance Criteria:**
  1. Verifikasi OTP dikirim melalui WhatsApp API.
  2. Session token disimpan dengan aman di local storage.
- **Developer Tasks:**
  - *Frontend:* Form UI Login & OTP Modal
  - *Backend:* API Authentication JWT & WA Gateway integration

## FEATURE: Payment & Order Processing (Badge: FASE 1)
**Deskripsi Modul:** Modul transaksi pembayaran online dan pembuatan pesanan.

### SUB-FEATURE: Integrasi Payment Gateway (QRIS & VA)
- **User Story:** Sebagai pembeli, saya ingin membayar via QRIS atau Virtual Account agar transaksi instan.`;

const samplePRD_B = `# ROOT NODE: Smart POS & Inventory System
**Tujuan Utama:** Sistem Kasir Kasir & Stok Opname Realtime untuk Toko Ritel dan Restoran.

## FEATURE: Kasir Transaksi Quick Sale (Badge: FASE 1)
**Deskripsi Modul:** Penjualan produk cepat dengan barcode scanner dan cetak struk bluetooth.

### SUB-FEATURE: Pembayaran Tunai & QRIS Kasir
- **User Story:** Sebagai kasir, saya ingin menerima pembayaran tunai atau QRIS agar antrean tidak mengular.
- **Acceptance Criteria:**
  1. Cetak struk otomatis via printer thermal bluetooth.

## FEATURE: Manajemen Stok Opname (Badge: FASE 1)
**Deskripsi Modul:** Pelacakan masuk keluar barang dan peringatan stok menipis.

### SUB-FEATURE: Peringatan Stok Minimum
- **User Story:** Sebagai pemilik toko, saya ingin notifikasi saat produk hampir habis.`;

const initialProjects: ProjectItem[] = [
  {
    id: DUMMY_PROJECT_ID,
    title: 'E-Commerce Marketplace Platform',
    client_name: 'PT Javas',
    prd_text: samplePRD_A,
  },
  {
    id: 'p-pos-002',
    title: 'Smart POS & Inventory System',
    client_name: 'PT Nusantara Tech',
    prd_text: samplePRD_B,
  },
  {
    id: 'p-mbank-003',
    title: 'Mobile Banking SuperApp',
    client_name: 'Bank Berdikari',
    prd_text: 'Judul: Mobile Banking SuperApp\n1. Fitur Utama: Transfer BI-Fast\n2. Fitur Utama: QRIS Merchant',
  },
];

// Helper to parse PRD string to nodes & edges
function generateFlowFromPRDText(prdText: string) {
  if (!prdText || !prdText.trim()) {
    return { nodes: [], edges: [] };
  }

  const lines = prdText.split('\n');
  let title = 'Smart Application Flow';
  const parsedFeatures: { title: string; items: string[] }[] = [];
  let currentFeature: { title: string; items: string[] } | null = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith('judul:')) {
      title = trimmed.replace(/judul:/i, '').trim();
    } else if (trimmed.startsWith('# ROOT NODE:')) {
      title = trimmed.replace('# ROOT NODE:', '').trim();
    } else if (/^\#\#\s*FEATURE:/i.test(trimmed) || /^\d+\.\s*fitur/i.test(trimmed) || /^\d+\.\s*/.test(trimmed)) {
      if (currentFeature) parsedFeatures.push(currentFeature);
      currentFeature = {
        title: trimmed.replace(/^(\#\#\s*FEATURE:|\d+\.\s*(fitur utama:)?)\s*/i, '').replace(/\(Badge:.*\)/i, '').trim(),
        items: [],
      };
    } else if (trimmed.startsWith('### SUB-FEATURE:') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      if (currentFeature && (trimmed.startsWith('-') || trimmed.startsWith('*'))) {
        currentFeature.items.push(trimmed.replace(/^[-*]\s*/, '').trim());
      } else if (currentFeature && trimmed.startsWith('### SUB-FEATURE:')) {
        currentFeature.items.push(trimmed.replace('### SUB-FEATURE:', '').trim());
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

  return { nodes: newNodes, edges: newEdges };
}

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>(DUMMY_PROJECT_ID);

  // Per-project flow state storage dictionary: { [projectId]: { nodes, edges } }
  const [projectFlowsMap, setProjectFlowsMap] = useState<Record<string, ProjectFlowData>>({});

  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  const activeProject = projectsList.find((p) => p.id === activeProjectId) || projectsList[0];

  // Auto layout helper
  const autoLayout = useCallback(() => {
    setNodes((nds) => {
      if (!nds || nds.length === 0) return nds;
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

  // Load project list & per-project flow whenever activeProjectId changes!
  useEffect(() => {
    async function loadActiveProjectData() {
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
          return;
        }
      }

      // If Supabase is not used or flow not found in DB: Load from isolated projectFlowsMap / PRD text
      if (projectFlowsMap[activeProjectId]) {
        setNodes(projectFlowsMap[activeProjectId].nodes);
        setEdges(projectFlowsMap[activeProjectId].edges);
      } else {
        const currentProj = projectsList.find((p) => p.id === activeProjectId);
        if (currentProj && currentProj.prd_text && currentProj.prd_text.trim()) {
          const { nodes: newN, edges: newE } = generateFlowFromPRDText(currentProj.prd_text);
          setNodes(newN);
          setEdges(newE);
          setProjectFlowsMap((prev) => ({
            ...prev,
            [activeProjectId]: { nodes: newN, edges: newE, prdText: currentProj.prd_text },
          }));
        } else {
          setNodes([]);
          setEdges([]);
        }
      }
    }

    loadActiveProjectData();
  }, [activeProjectId]);

  // Sync state changes back into projectFlowsMap
  useEffect(() => {
    if (activeProjectId) {
      setProjectFlowsMap((prev) => ({
        ...prev,
        [activeProjectId]: {
          ...prev[activeProjectId],
          nodes,
          edges,
          prdText: activeProject?.prd_text,
        },
      }));
    }
  }, [nodes, edges, activeProjectId]);

  // Run initial layout
  useEffect(() => {
    if (nodes.length > 0 && nodes[0].position.x === 0 && nodes[0].position.y === 0) {
      autoLayout();
    }
  }, [nodes, autoLayout]);

  const loadNodesFromPRD = useCallback((prdText: string) => {
    const { nodes: newNodes, edges: newEdges } = generateFlowFromPRDText(prdText);
    setNodes(newNodes);
    setEdges(newEdges);

    // Save PRD text to active project
    setProjectsList((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, prd_text: prdText } : p))
    );

    setProjectFlowsMap((prev) => ({
      ...prev,
      [activeProjectId]: { nodes: newNodes, edges: newEdges, prdText },
    }));

    setTimeout(() => {
      autoLayout();
    }, 100);
  }, [activeProjectId, autoLayout]);

  const updateActiveProjectPRD = useCallback((prdText: string) => {
    setProjectsList((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, prd_text: prdText } : p))
    );
  }, [activeProjectId]);

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

    // Make new project flow 100% EMPTY!
    setProjectFlowsMap((prev) => ({
      ...prev,
      [realProjectId]: { nodes: [], edges: [], prdText: prdText || '' },
    }));

    setActiveProjectId(realProjectId);
    setNodes([]);
    setEdges([]);

    return realProjectId;
  };

  const deleteProject = async (projectId: string) => {
    setProjectsList((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      if (activeProjectId === projectId && updated.length > 0) {
        setActiveProjectId(updated[0].id);
      }
      return updated;
    });

    setProjectFlowsMap((prev) => {
      const copy = { ...prev };
      delete copy[projectId];
      return copy;
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
        updateActiveProjectPRD,
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
