import { ProjectMember, Status } from './project.model';

export interface Task {
  id: number;
  ref: number;
  user_story: number | null;
  user_story_extra_info: {
    id: number;
    ref: number;
    subject: string;
    epics: any[] | null;
  } | null;
  project: number;
  project_slug: string;
  project_name: string;
  owner: number;
  owner_extra_info: ProjectMember;
  assigned_to: number | null;
  assigned_to_extra_info: ProjectMember | null;
  status: number;
  status_extra_info: Status;
  is_blocked: boolean;
  blocked_note: string;
  is_iocaine: boolean;
  is_closed: boolean;
  subject: string;
  description: string;
  description_html: string;
  created_date: string;
  modified_date: string;
  finished_date: string | null;
  due_date: string | null;
  due_date_reason: string;
  due_date_status: string;
  external_reference: any;
  tribe_gig: any;
  version: number;
  watchers: number[];
  is_watcher: boolean;
  total_watchers: number;
  tags: string[];
  tags_colors: { [key: string]: string | null };
}

export interface CreateTaskData {
  project: number;
  subject: string;
  description?: string;
  status?: number;
  user_story?: number;
  assigned_to?: number;
  due_date?: string;
  tags?: string[];
}

export interface UpdateTaskData {
  subject?: string;
  description?: string;
  status?: number;
  user_story?: number | null;
  assigned_to?: number | null;
  due_date?: string | null;
  is_blocked?: boolean;
  blocked_note?: string;
  tags?: string[];
  version: number;
}

export interface TaskFilter {
  project?: number;
  user_story?: number;
  milestone?: number;
  status?: number;
  assigned_to?: number;
  owner?: number;
  tags?: string[];
  is_closed?: boolean;
}
