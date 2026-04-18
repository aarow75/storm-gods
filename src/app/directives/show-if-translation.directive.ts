import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy, effect } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Directive({
  selector: '[appShowIfTranslation]',
  standalone: true
})
export class ShowIfTranslationDirective implements OnInit, OnDestroy {
  private translationKey = '';

  @Input() set appShowIfTranslation(key: string) {
    this.translationKey = key;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private translationService: TranslationService
  ) {
    // React to locale changes
    effect(() => {
      this.translationService.locale();
      this.updateView();
    });
  }

  ngOnInit(): void {
    this.updateView();
  }

  ngOnDestroy(): void {
    this.viewContainer.clear();
  }

  private updateView(): void {
    this.viewContainer.clear();
    if (this.translationService.hasTranslation(this.translationKey)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
