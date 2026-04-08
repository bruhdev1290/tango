export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_date: string;
  modified_date: string;
  owner: ProjectMember;
  members: ProjectMember[];
  total_memberships: number;
  is_private: boolean;
  is_featured: boolean;
  is_fan: boolean;
  is_watcher: boolean;
  is_contact_activated: boolean;
  is_epics_activated: boolean;
  is_backlog_activated: boolean;
  is_kanban_activated: boolean;
  is_wiki_activated: boolean;
  is_issues_activated: boolean;
  i_am_owner: boolean;
  i_am_admin: boolean;
  i_am_member: boolean;
  logo_big_url: string | null;
  logo_small_url: string | null;
  anon_permissions: string[];
  public_permissions: string[];
  my_permissions: string[];
  my_homepage: boolean;
  notify_level: number;
  blocked_code: string | null;
  total_activity: number;
  total_activity_last_month: number;
  total_activity_last_week: number;
  total_activity_last_year: number;
  total_closed_milestones: number;
  total_fans: number;
  total_milestones: number;
  total_story_points: number;
  total_watchers: number;
  tags: string[];
  tags_colors: { [key: string]: string | null };
  transfer_token: string;
}

export interface ProjectMember {
  id: number;
  username: string;
  full_name: string;
  full_name_display: string;
  color: string;
  photo: string | null;
  big_photo: string | null;
  gravatar_id: string;
  is_active: boolean;
  role?: number;
  role_name?: string;
}

export interface ProjectDetail extends Project {
  epic_statuses: Status[];
  us_statuses: UserStoryStatus[];
  task_statuses: Status[];
  issue_statuses: Status[];
  issue_types: IssueType[];
  priorities: Priority[];
  severities: Severity[];
  points: Point[];
  roles: Role[];
  milestones: MilestoneSummary[];
  epic_custom_attributes: CustomAttribute[];
  us_custom_attributes: CustomAttribute[];
  task_custom_attributes: CustomAttribute[];
  issue_custom_attributes: CustomAttribute[];
  us_duedates: DueDate[];
  task_duedates: DueDate[];
  issue_duedates: DueDate[];
  creation_template: any;
  default_epic_status: number | null;
  default_us_status: number | null;
  default_task_status: number | null;
  default_issue_status: number | null;
  default_issue_type: number | null;
  default_priority: number | null;
  default_severity: number | null;
  default_points: number | null;
}

export interface Status {
  id: number;
  name: string;
  slug: string;
  color: string;
  order: number;
  is_closed: boolean;
  project_id: number;
}

export interface UserStoryStatus extends Status {
  is_archived: boolean;
  wip_limit: number | null;
}

export interface IssueType {
  id: number;
  name: string;
  color: string;
  order: number;
  project_id: number;
}

export interface Priority {
  id: number;
  name: string;
  color: string;
  order: number;
  project_id: number;
}

export interface Severity {
  id: number;
  name: string;
  color: string;
  order: number;
  project_id: number;
}

export interface Point {
  id: number;
  name: string;
  order: number;
  value: number | null;
  project_id: number;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  order: number;
  computable: boolean;
  permissions: string[];
  project_id: number;
}

export interface MilestoneSummary {
  id: number;
  name: string;
  slug: string;
  closed: boolean;
}

export interface CustomAttribute {
  id: number;
  name: string;
  description: string;
  type: string;
  order: number;
  project_id: number;
  created_date: string;
  modified_date: string;
  extra: any;
}

export interface DueDate {
  id: number;
  name: string;
  color: string;
  order: number;
  days_to_due: number | null;
  by_default: boolean;
  project_id: number;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  is_private?: boolean;
}
