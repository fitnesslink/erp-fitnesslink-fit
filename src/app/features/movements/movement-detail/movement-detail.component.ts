import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MovementService } from '../../../core/services/movement.service';
import { MovementDetail } from '../../../core/models/movement.model';

@Component({
  selector: 'app-movement-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movement-detail.component.html',
  styleUrl: './movement-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementDetailComponent implements OnInit {
  private movementService = inject(MovementService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  movement = signal<MovementDetail | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.movementService
      .getMovement(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (movement) => {
          this.movement.set(movement);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  onEdit() {
    const m = this.movement();
    if (m) {
      this.router.navigate(['/movements', m.id, 'edit']);
    }
  }

  onBack() {
    this.router.navigate(['/movements']);
  }
}
