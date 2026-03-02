import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkoutService } from '../../../core/services/workout.service';
import { ClassificationService } from '../../../core/services/classification.service';
import { ContentStatus } from '../../../core/models/classification.model';
import { WorkoutDetail, UpdateWorkoutDto } from '../../../core/models/workout.model';

@Component({
  selector: 'app-workout-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './workout-edit.component.html',
  styleUrl: './workout-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutEditComponent implements OnInit {
  private workoutService = inject(WorkoutService);
  private classificationService = inject(ClassificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private updateTrigger = new Subject<{ id: string; dto: UpdateWorkoutDto }>();

  statuses = signal<ContentStatus[]>([]);
  loading = signal(true);
  submitting = signal(false);
  workout = signal<WorkoutDetail | null>(null);

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    estimatedTime: new FormControl(0, { nonNullable: true, validators: [Validators.min(1)] }),
    statusId: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    this.updateTrigger
      .pipe(
        switchMap(({ id, dto }) => {
          this.submitting.set(true);
          return this.workoutService.updateWorkout(id, dto);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/workouts']);
        },
        error: () => this.submitting.set(false),
      });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.classificationService
      .getContentStatuses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((statuses) => this.statuses.set(statuses));

    this.workoutService
      .getWorkout(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((workout) => {
        this.workout.set(workout);
        this.form.patchValue({
          name: workout.name,
          description: workout.description || '',
          estimatedTime: workout.estimatedTime,
        });
        this.loading.set(false);
      });
  }

  onSubmit() {
    const w = this.workout();
    if (this.form.invalid || !w) return;

    const dto: UpdateWorkoutDto = {
      name: this.form.value.name || undefined,
      description: this.form.value.description || undefined,
      estimatedTime: this.form.value.estimatedTime || undefined,
      statusId: this.form.value.statusId || undefined,
    };

    this.updateTrigger.next({ id: w.id, dto });
  }

  onCancel() {
    this.router.navigate(['/workouts']);
  }
}
