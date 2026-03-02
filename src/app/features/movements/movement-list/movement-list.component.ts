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
import { MovementService } from '../../../core/services/movement.service';
import { MovementListView } from '../../../core/models/movement.model';
import { PagedResult } from '../../../core/models/pagination.model';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { SearchbarComponent } from '../../../shared/components/searchbar/searchbar.component';
import { PagingComponent } from '../../../shared/components/paging/paging.component';
import { TableMenuComponent } from '../../../shared/components/table-menu/table-menu.component';
import { FilterSortMenuComponent } from '../../../shared/components/filter-sort-menu/filter-sort-menu.component';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    SearchbarComponent,
    PagingComponent,
    TableMenuComponent,
    FilterSortMenuComponent,
  ],
  templateUrl: './movement-list.component.html',
  styleUrl: './movement-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementListComponent implements OnInit {
  private movementService = inject(MovementService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private refreshTrigger = new Subject<void>();
  private deleteTrigger = new Subject<string>();

  page = signal<PagedResult<MovementListView> | null>(null);
  loading = signal(false);

  menuItems = ['View', 'Edit', 'Delete'];
  toolbarActions = [{ label: 'New Movement', icon: 'fa-solid fa-plus', type: 'primary' as const }];

  private pageNumber = 1;
  private pageSize = 20;

  constructor() {
    this.refreshTrigger
      .pipe(
        switchMap(() => {
          this.loading.set(true);
          return this.movementService.getMovements({
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

    this.deleteTrigger
      .pipe(
        switchMap((id) => this.movementService.deleteMovement(id)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.refresh());
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
    if (action === 'New Movement') {
      this.router.navigate(['/movements/create']);
    }
  }

  onMenuAction(event: { item: string; id: string }) {
    switch (event.item) {
      case 'View':
        this.router.navigate(['/movements', event.id]);
        break;
      case 'Edit':
        this.router.navigate(['/movements', event.id, 'edit']);
        break;
      case 'Delete':
        this.deleteTrigger.next(event.id);
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
