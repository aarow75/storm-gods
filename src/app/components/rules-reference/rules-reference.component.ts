import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MarkdownService, type TocItem } from '../../services/markdown.service';
import { GameSystemService } from '../../services/game-system.service';
import { switchMap, timeout, map, catchError, tap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-rules-reference',
  imports: [CommonModule],
  templateUrl: './rules-reference.component.html',
  styleUrl: './rules-reference.component.css'
})
export class RulesReferenceComponent implements OnInit, OnDestroy {
  html: SafeHtml = '';
  toc: TocItem[] = [];
  isLoading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private markdown: MarkdownService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private gameSystem: GameSystemService
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.error = null;
        }),
        switchMap(params => {
          const filename = params['file'] || 'I-introduction';
          const system = this.gameSystem.gameSystem();
          return this.http.get(`/docs/${system}/rules/${filename}.md`, { responseType: 'text' })
            .pipe(timeout(5000));
        }),
        map(content => {
          const html = this.markdown.renderMarkdown(content);
          const toc = this.markdown.generateToc(content);
          return { html, toc };
        }),
        catchError(err => {
          this.error = `Failed to load: ${err.status || 'Network error'}`;
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (result: any) => {
          if (result) {
            this.html = this.sanitizer.bypassSecurityTrustHtml(result.html);
            this.toc = result.toc;
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scrollToSection(anchor: string) {
    setTimeout(() => {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }
}
