import { ProjectMember } from './project.model';

export interface WikiPage {
  id: number;
  slug: string;
  content: string;
  project: number;
  owner: number;
  owner_extra_info: ProjectMember;
  last_modifier: number;
  last_modifier_extra_info: ProjectMember;
  created_date: string;
  modified_date: string;
  version: number;
  editions: number;
}

export interface WikiLink {
  id: number;
  title: string;
  href: string;
  order: number;
  project: number;
}

export interface CreateWikiPageData {
  project: number;
  slug: string;
  content: string;
}

export interface UpdateWikiPageData {
  content: string;
  version: number;
}

export interface CreateWikiLinkData {
  project: number;
  title: string;
  href: string;
  order?: number;
}
