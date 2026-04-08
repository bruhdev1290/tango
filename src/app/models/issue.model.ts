import { ProjectMember, Status, IssueType, Priority, Severity } from './project.model';

export interface Issue {
  id: number;
  ref: number;
  project: number;
  project_slug: string;
  project_name: string;
  milestone: number | null;
  milestone_slug: string | null;
  milestone_name: string | null;
  owner: number;
  owner_extra_info: ProjectMember;
  assigned_to: number | null;
  assigned_to_extra_info: ProjectMember | null;
  status: number;
  status_extra_info: Status;
  type: number;
  type_extra_info: IssueType;
  priority: number;
  priority_extra_info: Priority;
  severity: number;
  severity_extra_info: Severity;
  is_blocked: boolean;
  blocked_note: string;
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
  voters: number[];
  is_voter: boolean;
  total_voters: number;
  tags: string[];
  tags_colors: { [key: string]: string | null };
}

export interface CreateIssueData {
  project: number;
  subject: string;
  description?: string;
  type?: number;
  status?: number;
  priority?: number;
  severity?: number;
  milestone?: number;
  assigned_to?: number;
  due_date?: string;
  tags?: string[];
}

export interface UpdateIssueData {
  subject?: string;
  description?: string;
  type?: number;
  status?: number;
  priority?: number;
  severity?: number;
  milestone?: number | null;
  assigned_to?: number | null;
  due_date?: string | null;
  is_blocked?: boolean;
  blocked_note?: string;
  tags?: string[];
  version: number;
}

export interface IssueFilter {
  project?: number;
  milestone?: number;
  status?: number;
  type?: number;
  priority?: number;
  severity?: number;
  assigned_to?: number;
  owner?: number;
  tags?: string[];
  is_closed?: boolean;
}
