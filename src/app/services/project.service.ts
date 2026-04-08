import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectDetail, CreateProjectData, ProjectMember } from '../models';
import { ServerConfigService } from './server-config.service';

interface PaginationParams {
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private http: HttpClient,
    private serverConfig: ServerConfigService
  ) {}

  private get apiUrl(): string {
    return this.serverConfig.getActiveServerUrl();
  }

  getProjects(params?: PaginationParams): Observable<Project[]> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.page_size) {
      httpParams = httpParams.set('page_size', params.page_size.toString());
    }
    return this.http.get<Project[]>(`${this.apiUrl}/projects`, { params: httpParams });
  }

  getProject(projectId: number): Observable<ProjectDetail> {
    return this.http.get<ProjectDetail>(`${this.apiUrl}/projects/${projectId}`);
  }

  getProjectBySlug(slug: string): Observable<ProjectDetail> {
    return this.http.get<ProjectDetail>(`${this.apiUrl}/projects/by_slug?slug=${slug}`);
  }

  createProject(data: CreateProjectData): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, data);
  }

  updateProject(projectId: number, data: Partial<Project>): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/projects/${projectId}`, data);
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${projectId}`);
  }

  getProjectMembers(projectId: number): Observable<ProjectMember[]> {
    return this.http.get<ProjectMember[]>(`${this.apiUrl}/projects/${projectId}/members`);
  }

  addProjectMember(projectId: number, username: string, role: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${projectId}/members`, {
      username,
      role
    });
  }

  removeProjectMember(projectId: number, memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${projectId}/members/${memberId}`);
  }

  likeProject(projectId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${projectId}/like`, {});
  }

  unlikeProject(projectId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${projectId}/unlike`, {});
  }

  watchProject(projectId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${projectId}/watch`, {});
  }

  unwatchProject(projectId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${projectId}/unwatch`, {});
  }

  getProjectStats(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${projectId}/stats`);
  }

  searchProjects(query: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`, {
      params: new HttpParams().set('q', query)
    });
  }
}
