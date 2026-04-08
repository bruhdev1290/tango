import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStory, CreateUserStoryData, UpdateUserStoryData, UserStoryFilter } from '../models';
import { ServerConfigService } from './server-config.service';

interface PaginationParams {
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserStoryService {
  constructor(
    private http: HttpClient,
    private serverConfig: ServerConfigService
  ) {}

  private get apiUrl(): string {
    return this.serverConfig.getActiveServerUrl();
  }

  getUserStories(filter?: UserStoryFilter, pagination?: PaginationParams): Observable<UserStory[]> {
    let params = new HttpParams();
    
    if (filter?.project) {
      params = params.set('project', filter.project.toString());
    }
    if (filter?.milestone) {
      params = params.set('milestone', filter.milestone.toString());
    }
    if (filter?.status) {
      params = params.set('status', filter.status.toString());
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

    return this.http.get<UserStory[]>(`${this.apiUrl}/userstories`, { params });
  }

  getUserStory(userStoryId: number): Observable<UserStory> {
    return this.http.get<UserStory>(`${this.apiUrl}/userstories/${userStoryId}`);
  }

  getUserStoryByRef(projectId: number, ref: number): Observable<UserStory> {
    return this.http.get<UserStory>(`${this.apiUrl}/userstories/by_ref?project=${projectId}&ref=${ref}`);
  }

  createUserStory(data: CreateUserStoryData): Observable<UserStory> {
    return this.http.post<UserStory>(`${this.apiUrl}/userstories`, data);
  }

  updateUserStory(userStoryId: number, data: UpdateUserStoryData): Observable<UserStory> {
    return this.http.patch<UserStory>(`${this.apiUrl}/userstories/${userStoryId}`, data);
  }

  deleteUserStory(userStoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/userstories/${userStoryId}`);
  }

  bulkUpdateStatus(userStoryIds: number[], statusId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/userstories/bulk_update_backlog_order`, {
      bulk_userstories: userStoryIds,
      status: statusId
    });
  }

  upvote(userStoryId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/userstories/${userStoryId}/upvote`, {});
  }

  downvote(userStoryId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/userstories/${userStoryId}/downvote`, {});
  }

  watch(userStoryId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/userstories/${userStoryId}/watch`, {});
  }

  unwatch(userStoryId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/userstories/${userStoryId}/unwatch`, {});
  }

  getFiltersData(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/userstories/filters_data?project=${projectId}`);
  }
}
