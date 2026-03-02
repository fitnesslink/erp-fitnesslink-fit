import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-table-menu',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './table-menu.component.html',
  styleUrl: './table-menu.component.scss',
})
export class TableMenuComponent {
  @Input() id = '';
  @Input() menuItems: string[] = [];
  @Output() selectedMenuItem = new EventEmitter<{
    item: string;
    id: string;
  }>();

  showMenu = false;

  onMenuOptionClick(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  onSelectedMenuItem(item: string) {
    this.selectedMenuItem.emit({ item, id: this.id });
    this.showMenu = false;
  }

  onClose() {
    this.showMenu = false;
  }
}
