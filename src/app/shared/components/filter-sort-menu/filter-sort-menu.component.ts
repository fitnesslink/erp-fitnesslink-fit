import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

export interface SortOption {
  label: string;
  field: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-filter-sort-menu',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './filter-sort-menu.component.html',
  styleUrl: './filter-sort-menu.component.scss',
})
export class FilterSortMenuComponent {
  @Input() sortOptions: SortOption[] = [];
  @Output() sortChange = new EventEmitter<SortOption>();

  showSortMenu = false;
  activeSort: SortOption | null = null;

  toggleSortMenu() {
    this.showSortMenu = !this.showSortMenu;
  }

  onCloseSortMenu() {
    this.showSortMenu = false;
  }

  onSelectSort(option: SortOption) {
    this.activeSort = option;
    this.showSortMenu = false;
    this.sortChange.emit(option);
  }
}
