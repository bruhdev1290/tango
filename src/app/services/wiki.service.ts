import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WikiPage, WikiLink, CreateWikiPageData, UpdateWikiPageData, CreateWikiLinkData } from '../models';
import { ServerConfigService } from './server-config.service';

@Injectable({
  providedIn: 'root'
})
export class WikiService {
  constructor(
    private http: HttpClient,
    private serverConfig: ServerConfigService
  ) {}

  private get apiUrl(): string {
    return this.serverConfig.getActiveServerUrl();
  }

  getWikiPages(projectId: number): Observable<WikiPage[]> {
    return this.http.get<WikiPage[]>(`${this.apiUrl}/wiki?project=${projectId}`);
  }

  getWikiPage(projectId: number, slug: string): Observable<WikiPage> {
    return this.http.get<WikiPage>(`${this.apiUrl}/wiki/by_slug?project=${projectId}&slug=${slug}`);
  }

  createWikiPage(data: CreateWikiPageData): Observable<WikiPage> {
    return this.http.post<WikiPage>(`${this.apiUrl}/wiki`, data);
  }

  updateWikiPage(wikiPageId: number, data: UpdateWikiPageData): Observable<WikiPage> {
    return this.http.patch<WikiPage>(`${this.apiUrl}/wiki/${wikiPageId}`, data);
  }

  deleteWikiPage(wikiPageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/wiki/${wikiPageId}`);
  }

  getWikiLinks(projectId: number): Observable<WikiLink[]> {
    return this.http.get<WikiLink[]>(`${this.apiUrl}/wiki-links?project=${projectId}`);
  }

  createWikiLink(data: CreateWikiLinkData): Observable<WikiLink> {
    return this.http.post<WikiLink>(`${this.apiUrl}/wiki-links`, data);
  }

  updateWikiLink(linkId: number, data: Partial<CreateWikiLinkData>): Observable<WikiLink> {
    return this.http.patch<WikiLink>(`${this.apiUrl}/wiki-links/${linkId}`, data);
  }

  deleteWikiLink(linkId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/wiki-links/${linkId}`);
  }
}
