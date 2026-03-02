import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgramService } from '../../../core/services/program.service';
import { ProgramListItem } from '../../../core/models/program.model';
import { PagedResult } from '../../../core/models/pagination.model';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { SearchbarComponent } from '../../../shared/components/searchbar/searchbar.component';
import { PagingComponent } from '../../../shared/components/paging/paging.component';
import { TableMenuComponent } from '../../../shared/components/table-menu/table-menu.component';
import { FilterSortMenuComponent } from '../../../shared/components/filter-sort-menu/filter-sort-menu.component';

@Component({
  selector: 'app-program-list',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    SearchbarComponent,
    PagingComponent,
    TableMenuComponent,
    FilterSortMenuComponent,
  ],
  templateUrl: './program-list.component.html',
  styleUrl: './program-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramListComponent implements OnInit {
  private programService = inject(ProgramService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private refreshTrigger = new Subject<void>();

  page = signal<PagedResult<ProgramListItem> | null>(null);
  loading = signal(false);

  menuItems = ['View', 'Edit'];
  toolbarActions = [{ label: 'New Program', icon: 'fa-solid fa-plus', type: 'primary' as const }];

  private pageNumber = 1;
  private pageSize = 20;

  constructor() {
    this.refreshTrigger
      .pipe(
        switchMap(() => {
          this.loading.set(true);
          return this.programService.getPrograms({
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result) => {
        this.page.set(result);
        this.loading.set(false);
      });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.refreshTrigger.next();
  }

  onSearch(term: string) {
    this.pageNumber = 1;
    this.refresh();
  }

  onToolbarAction(action: string) {
    if (action === 'New Program') {
      this.router.navigate(['/programs/create']);
    }
  }

  onMenuAction(event: { item: string; id: string }) {
    switch (event.item) {
      case 'View':
        this.router.navigate(['/programs', event.id]);
        break;
      case 'Edit':
        this.router.navigate(['/programs', event.id, 'edit']);
        break;
    }
  }

  nextPage() {
    this.pageNumber++;
    this.refresh();
  }

  previousPage() {
    this.pageNumber--;
    this.refresh();
  }

  selectPageSize(size: number) {
    this.pageNumber = 1;
    this.pageSize = size;
    this.refresh();
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase() === 'published' ? 'published' : '';
  }
}
