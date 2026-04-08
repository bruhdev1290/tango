import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Epic, CreateEpicData, UpdateEpicData } from '../models';
import { ServerConfigService } from './server-config.service';

interface PaginationParams {
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EpicService {
  constructor(
    private http: HttpClient,
    private serverConfig: ServerConfigService
  ) {}

  private get apiUrl(): string {
    return this.serverConfig.getActiveServerUrl();
  }

  getEpics(projectId: number, pagination?: PaginationParams): Observable<Epic[]> {
    let params = new HttpParams().set('project', projectId.toString());
    
    if (pagination?.page) {
      params = params.set('page', pagination.page.toString());
    }
    if (pagination?.page_size) {
      params = params.set('page_size', pagination.page_size.toString());
    }

    return this.http.get<Epic[]>(`${this.apiUrl}/epics`, { params });
  }

  getEpic(epicId: number): Observable<Epic> {
    return this.http.get<Epic>(`${this.apiUrl}/epics/${epicId}`);
  }

  createEpic(data: CreateEpicData): Observable<Epic> {
    return this.http.post<Epic>(`${this.apiUrl}/epics`, data);
  }

  updateEpic(epicId: number, data: UpdateEpicData): Observable<Epic> {
    return this.http.patch<Epic>(`${this.apiUrl}/epics/${epicId}`, data);
  }

  deleteEpic(epicId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/epics/${epicId}`);
  }

  getRelatedUserStories(epicId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/epics/${epicId}/related_userstories`);
  }

  addRelatedUserStory(epicId: number, userStoryId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/epics/${epicId}/related_userstories`, {
      user_story: userStoryId
    });
  }

  removeRelatedUserStory(epicId: number, userStoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/epics/${epicId}/related_userstories/${userStoryId}`);
  }

  upvote(epicId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/epics/${epicId}/upvote`, {});
  }

  downvote(epicId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/epics/${epicId}/downvote`, {});
  }

  watch(epicId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/epics/${epicId}/watch`, {});
  }

  unwatch(epicId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/epics/${epicId}/unwatch`, {});
  }

  getFiltersData(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/epics/filters_data?project=${projectId}`);
  }
}
