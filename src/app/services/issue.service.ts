import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue, CreateIssueData, UpdateIssueData, IssueFilter } from '../models';
import { ServerConfigService } from './server-config.service';

interface PaginationParams {
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  constructor(
    private http: HttpClient,
    private serverConfig: ServerConfigService
  ) {}

  private get apiUrl(): string {
    return this.serverConfig.getActiveServerUrl();
  }

  getIssues(filter?: IssueFilter, pagination?: PaginationParams): Observable<Issue[]> {
    let params = new HttpParams();
    
    if (filter?.project) {
      params = params.set('project', filter.project.toString());
    }
    if (filter?.milestone !== undefined) {
      params = params.set('milestone', filter.milestone?.toString() || 'null');
    }
    if (filter?.status) {
      params = params.set('status', filter.status.toString());
    }
    if (filter?.type) {
      params = params.set('type', filter.type.toString());
    }
    if (filter?.priority) {
      params = params.set('priority', filter.priority.toString());
    }
    if (filter?.severity) {
      params = params.set('severity', filter.severity.toString());
    }
    if (filter?.assigned_to !== undefined) {
      params = params.set('assigned_to', filter.assigned_to?.toString() || 'null');
    }
    if (filter?.owner) {
      params = params.set('owner', filter.owner.toString());
    }
    if (filter?.is_closed !== undefined) {
      params = params.set('is_closed', filter.is_closed.toString());
    }
    
    if (pagination?.page) {
      params = params.set('page', pagination.page.toString());
    }
    if (pagination?.page_size) {
      params = params.set('page_size', pagination.page_size.toString());
    }

    return this.http.get<Issue[]>(`${this.apiUrl}/issues`, { params });
  }

  getIssue(issueId: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/issues/${issueId}`);
  }

  getIssueByRef(projectId: number, ref: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/issues/by_ref?project=${projectId}&ref=${ref}`);
  }

  createIssue(data: CreateIssueData): Observable<Issue> {
    return this.http.post<Issue>(`${this.apiUrl}/issues`, data);
  }

  updateIssue(issueId: number, data: UpdateIssueData): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/issues/${issueId}`, data);
  }

  deleteIssue(issueId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/issues/${issueId}`);
  }

  upvote(issueId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/issues/${issueId}/upvote`, {});
  }

  downvote(issueId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/issues/${issueId}/downvote`, {});
  }

  watch(issueId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/issues/${issueId}/watch`, {});
  }

  unwatch(issueId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/issues/${issueId}/unwatch`, {});
  }

  getFiltersData(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/issues/filters_data?project=${projectId}`);
  }
}
