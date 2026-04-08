import { ProjectMember, Status } from './project.model';

export interface Epic {
  id: number;
  ref: number;
  project: number;
  project_slug: string;
  project_name: string;
  owner: number;
  owner_extra_info: ProjectMember;
  assigned_to: number | null;
  assigned_to_extra_info: ProjectMember | null;
  status: number;
  status_extra_info: Status;
  epics_order: number;
  is_blocked: boolean;
  blocked_note: string;
  is_closed: boolean;
  subject: string;
  description: string;
  description_html: string;
  created_date: string;
  modified_date: string;
  finish_date: string | null;
  due_date: string | null;
  due_date_reason: string;
  due_date_status: string;
  user_stories_counts: {
    total: number;
    progress: number;
    closed: number;
  };
  total_points: number | null;
  version: number;
  watchers: number[];
  is_watcher: boolean;
  total_watchers: number;
  tags: string[];
  tags_colors: { [key: string]: string | null };
}

export interface CreateEpicData {
  project: number;
  subject: string;
  description?: string;
  status?: number;
  assigned_to?: number;
  due_date?: string;
  tags?: string[];
}

export interface UpdateEpicData {
  subject?: string;
  description?: string;
  status?: number;
  assigned_to?: number | null;
  due_date?: string | null;
  is_blocked?: boolean;
  blocked_note?: string;
  tags?: string[];
  version: number;
}
