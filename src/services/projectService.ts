import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface DBProject {
  id: string;
  title: string;
  client_name: string;
  prd_text?: string;
  created_at?: string;
}

export interface DBNode {
  id: string;
  project_id?: string;
  type: string;
  position_x: number;
  position_y: number;
  title: string;
  subtitle?: string;
  phase?: string;
  status?: string;
  goals?: string;
  user_story?: string;
  acceptance_criteria?: string;
  dependencies?: string;
  items?: string[];
}

export interface DBEdge {
  id: string;
  project_id?: string;
  source: string;
  target: string;
  type?: string;
}

export const projectService = {
  // Fetch All Projects
  async getProjects(): Promise<DBProject[]> {
    if (!isSupabaseConfigured()) return [];
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return data || [];
  },

  async fetchProjects(): Promise<DBProject[]> {
    return this.getProjects();
  },

  // Create New Project in Supabase
  async createProject(title: string, clientName: string, prdText?: string): Promise<DBProject | null> {
    if (!isSupabaseConfigured()) return null;
    const newProject = {
      title,
      client_name: clientName,
      prd_text: prdText || '',
    };
    const { data, error } = await supabase.from('projects').insert([newProject]).select().single();
    if (error) {
      console.error('Error creating project in Supabase:', error);
      return null;
    }
    return data;
  },

  // Delete Project from Supabase
  async deleteProject(projectId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;
    try {
      await supabase.from('nodes').delete().eq('project_id', projectId);
      await supabase.from('edges').delete().eq('project_id', projectId);
      await supabase.from('projects').delete().eq('id', projectId);
      return true;
    } catch (err) {
      console.error('Error deleting project in Supabase:', err);
      return false;
    }
  },

  // Fetch Nodes & Edges for a Project
  async getProjectFlow(projectId: string) {
    if (!isSupabaseConfigured()) return { nodes: [], edges: [] };

    const [nodesRes, edgesRes] = await Promise.all([
      supabase.from('nodes').select('*').eq('project_id', projectId),
      supabase.from('edges').select('*').eq('project_id', projectId),
    ]);

    if (nodesRes.error || edgesRes.error) {
      console.error('Error fetching project flow:', nodesRes.error || edgesRes.error);
      return { nodes: [], edges: [] };
    }

    return {
      nodes: nodesRes.data || [],
      edges: edgesRes.data || [],
    };
  },

  // Save Nodes & Edges to Supabase
  async saveProjectFlow(projectId: string, nodes: DBNode[], edges: DBEdge[]) {
    if (!isSupabaseConfigured()) return false;

    try {
      // 1. Delete existing nodes & edges for project
      await supabase.from('nodes').delete().eq('project_id', projectId);
      await supabase.from('edges').delete().eq('project_id', projectId);

      // 2. Insert new nodes & edges
      if (nodes.length > 0) {
        const nodesToInsert = nodes.map(n => ({
          ...n,
          project_id: projectId,
        }));
        await supabase.from('nodes').insert(nodesToInsert);
      }

      if (edges.length > 0) {
        const edgesToInsert = edges.map(e => ({
          ...e,
          project_id: projectId,
        }));
        await supabase.from('edges').insert(edgesToInsert);
      }

      return true;
    } catch (err) {
      console.error('Error saving project flow to Supabase:', err);
      return false;
    }
  },
};
