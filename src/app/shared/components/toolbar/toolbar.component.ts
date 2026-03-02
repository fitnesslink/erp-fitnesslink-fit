import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToolbarAction {
  label: string;
  icon?: string;
  type?: 'primary' | 'danger' | 'default';
}

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  @Input() title = '';
  @Input() actions: ToolbarAction[] = [];
  @Output() actionClick = new EventEmitter<string>();

  onAction(label: string) {
    this.actionClick.emit(label);
  }
}
