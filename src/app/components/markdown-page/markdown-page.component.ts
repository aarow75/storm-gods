import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MarkdownService, type TocItem } from '../../services/markdown.service';
import { switchMap, timeout, map, catchError, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { of } from 'rxjs';
import { takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-markdown-page',
  imports: [CommonModule],
  templateUrl: './markdown-page.component.html',
  styleUrl: './markdown-page.component.css'
})
export class MarkdownPageComponent implements OnInit, OnDestroy {
  html: SafeHtml = '';
  toc: TocItem[] = [];
  isLoading = true;
  error: string | null = null;
  isFullscreen = false;

  private destroy$ = new Subject<void>();

  constructor(
    private markdown: MarkdownService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:fullscreenchange')
  onFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
    this.cdr.markForCheck();
  }

  toggleFullscreen() {
    const el = this.elementRef.nativeElement.querySelector('.markdown-page');
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.error = null;
        }),
        switchMap(params => {
          const file = params['file'];
          if (!file) {
            return of({ error: 'No file specified. Use ?file=path/to/file.md' });
          }
          return this.http.get(`/docs/${file}`, { responseType: 'text' }).pipe(
            timeout(5000),
            map(content => ({ content })),
            catchError(err => of({ error: `Failed to load: ${err.status || 'Network error'}` }))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        if ('error' in result) {
          this.error = result.error;
        } else {
          this.html = this.sanitizer.bypassSecurityTrustHtml(
            this.markdown.renderMarkdown(result.content)
          );
          this.toc = this.markdown.generateToc(result.content);
        }
        this.isLoading = false;
        this.cdr.markForCheck();
        const fragment = this.route.snapshot.fragment;
        if (fragment) {
          this.scrollToSection(fragment);
        }
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
