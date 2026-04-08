import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Milestone, CreateMilestoneData, UpdateMilestoneData } from '../models';
import { ServerConfigService } from './server-config.service';

@Injectable({
  providedIn: 'root'
})
export class MilestoneService {
  constructor(
    private http: HttpClient,
    private serverConfig: ServerConfigService
  ) {}

  private get apiUrl(): string {
    return this.serverConfig.getActiveServerUrl();
  }

  getMilestones(projectId: number): Observable<Milestone[]> {
    return this.http.get<Milestone[]>(`${this.apiUrl}/milestones?project=${projectId}`);
  }

  getMilestone(milestoneId: number): Observable<Milestone> {
    return this.http.get<Milestone>(`${this.apiUrl}/milestones/${milestoneId}`);
  }

  createMilestone(data: CreateMilestoneData): Observable<Milestone> {
    return this.http.post<Milestone>(`${this.apiUrl}/milestones`, data);
  }

  updateMilestone(milestoneId: number, data: UpdateMilestoneData): Observable<Milestone> {
    return this.http.patch<Milestone>(`${this.apiUrl}/milestones/${milestoneId}`, data);
  }

  deleteMilestone(milestoneId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/milestones/${milestoneId}`);
  }

  getMilestoneStats(milestoneId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/milestones/${milestoneId}/stats`);
  }

  getMilestoneWatchers(milestoneId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/milestones/${milestoneId}/watchers`);
  }
}
