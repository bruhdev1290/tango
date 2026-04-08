import { ProjectMember } from './project.model';

export interface Milestone {
  id: number;
  name: string;
  slug: string;
  project: number;
  project_name: string;
  project_slug: string;
  owner: number;
  owner_extra_info: ProjectMember;
  estimated_start: string;
  estimated_finish: string;
  created_date: string;
  modified_date: string;
  closed: boolean;
  disponibility: number;
  order: number;
  user_stories_counts: {
    total: number;
    progress: number;
    closed: number;
  };
  total_points: number | null;
  closed_points: number | null;
}

export interface MilestoneStats {
  id: number;
  name: string;
  slug: string;
  estimated_start: string;
  estimated_finish: string;
  closed: boolean;
  user_stories_counts: {
    total: number;
    progress: number;
    closed: number;
  };
  total_points: number | null;
  closed_points: number | null;
}

export interface CreateMilestoneData {
  project: number;
  name: string;
  estimated_start: string;
  estimated_finish: string;
}

export interface UpdateMilestoneData {
  name?: string;
  estimated_start?: string;
  estimated_finish?: string;
  closed?: boolean;
}
