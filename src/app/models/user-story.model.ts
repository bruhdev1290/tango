import { ProjectMember, UserStoryStatus } from './project.model';

export interface UserStory {
  id: number;
  ref: number;
  milestone: number | null;
  milestone_slug: string | null;
  milestone_name: string | null;
  project: number;
  project_slug: string;
  project_name: string;
  owner: number;
  owner_extra_info: ProjectMember;
  assigned_to: number | null;
  assigned_to_extra_info: ProjectMember | null;
  status: number;
  status_extra_info: UserStoryStatus;
  is_closed: boolean;
  points: { [roleId: string]: number | null };
  total_points: number | null;
  subject: string;
  description: string;
  description_html: string;
  created_date: string;
  modified_date: string;
  finish_date: string | null;
  due_date: string | null;
  due_date_reason: string;
  due_date_status: string;
  generated_from_issue: number | null;
  generated_from_task: number | null;
  from_task_ref: number | null;
  external_reference: any;
  tribe_gig: any;
  version: number;
  watchers: number[];
  is_watcher: boolean;
  total_watchers: number;
  is_voter: boolean;
  total_voters: number;
  tags: string[];
  tags_colors: { [key: string]: string | null };
}

export interface CreateUserStoryData {
  project: number;
  subject: string;
  description?: string;
  status?: number;
  milestone?: number;
  assigned_to?: number;
  due_date?: string;
  tags?: string[];
}

export interface UpdateUserStoryData {
  subject?: string;
  description?: string;
  status?: number;
  milestone?: number | null;
  assigned_to?: number | null;
  due_date?: string | null;
  points?: { [roleId: string]: number | null };
  tags?: string[];
  version: number;
}

export interface UserStoryFilter {
  project?: number;
  milestone?: number;
  status?: number;
  assigned_to?: number;
  owner?: number;
  tags?: string[];
  is_closed?: boolean;
}
