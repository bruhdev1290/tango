import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskData, UpdateTaskData, TaskFilter } from '../models';
import { ServerConfigService } from './server-config.service';

interface PaginationParams {
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(
    private http: HttpClient,
    private serverConfig: ServerConfigService
  ) {}

  private get apiUrl(): string {
    return this.serverConfig.getActiveServerUrl();
  }

  getTasks(filter?: TaskFilter, pagination?: PaginationParams): Observable<Task[]> {
    let params = new HttpParams();
    
    if (filter?.project) {
      params = params.set('project', filter.project.toString());
    }
    if (filter?.user_story !== undefined) {
      params = params.set('user_story', filter.user_story?.toString() || 'null');
    }
    if (filter?.milestone !== undefined) {
      params = params.set('milestone', filter.milestone?.toString() || 'null');
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

    return this.http.get<Task[]>(`${this.apiUrl}/tasks`, { params });
  }

  getTask(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${taskId}`);
  }

  getTaskByRef(projectId: number, ref: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/by_ref?project=${projectId}&ref=${ref}`);
  }

  createTask(data: CreateTaskData): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, data);
  }

  updateTask(taskId: number, data: UpdateTaskData): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${taskId}`, data);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}`);
  }

  watch(taskId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks/${taskId}/watch`, {});
  }

  unwatch(taskId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks/${taskId}/unwatch`, {});
  }

  getFiltersData(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks/filters_data?project=${projectId}`);
  }
}
