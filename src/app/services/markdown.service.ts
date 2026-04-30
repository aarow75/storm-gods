import { Injectable } from '@angular/core';
import MarkdownIt from 'markdown-it';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItAnchor from 'markdown-it-anchor';

export interface TocItem {
  level: number;
  title: string;
  anchor: string;
}

@Injectable({ providedIn: 'root' })
export class MarkdownService {
  private md = new MarkdownIt()
    .use(markdownItFootnote)
    .use(markdownItAnchor);

  renderMarkdown(content: string): string {
    return this.md.render(content);
  }

  generateToc(content: string): TocItem[] {
    const tokens = this.md.parse(content, {});
    const toc: TocItem[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === 'heading_open') {
        const level = parseInt(token.tag[1]);
        const nextToken = tokens[i + 1];

        if (nextToken?.type === 'inline' && nextToken.content) {
          const anchor = this.slugify(nextToken.content);
          toc.push({ level, title: nextToken.content, anchor });
        }
      }
    }

    return toc;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
