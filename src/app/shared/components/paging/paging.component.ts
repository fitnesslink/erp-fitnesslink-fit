import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { PagedResult } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-paging',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './paging.component.html',
  styleUrl: './paging.component.scss',
})
export class PagingComponent {
  @Input() page!: PagedResult<unknown>;
  @Output() nextPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();
  @Output() selectPageSize = new EventEmitter<number>();

  showMenu = false;
  pageSizeOptions = [20, 50, 100, 150];

  showOption(value: number) {
    return this.page?.pageSize !== value;
  }

  onSelectedMenuItem(pageSize: number) {
    this.showMenu = false;
    this.selectPageSize.emit(pageSize);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  onClose() {
    this.showMenu = false;
  }

  previous() {
    if (this.page?.hasPreviousPage) {
      this.previousPage.emit();
    }
  }

  next() {
    if (this.page?.hasNextPage) {
      this.nextPage.emit();
    }
  }
}
