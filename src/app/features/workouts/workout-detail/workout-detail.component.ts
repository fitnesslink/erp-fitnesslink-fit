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
import { WorkoutService } from '../../../core/services/workout.service';
import { WorkoutDetail } from '../../../core/models/workout.model';

@Component({
  selector: 'app-workout-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workout-detail.component.html',
  styleUrl: './workout-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutDetailComponent implements OnInit {
  private workoutService = inject(WorkoutService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  workout = signal<WorkoutDetail | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.workoutService
      .getWorkout(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (workout) => {
          this.workout.set(workout);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onEdit() {
    const w = this.workout();
    if (w) {
      this.router.navigate(['/workouts', w.id, 'edit']);
    }
  }

  onBack() {
    this.router.navigate(['/workouts']);
  }
}
