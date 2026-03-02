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
import { Router } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkoutService } from '../../../core/services/workout.service';
import { ClassificationService } from '../../../core/services/classification.service';
import { ContentStatus } from '../../../core/models/classification.model';
import { CreateWorkoutDto } from '../../../core/models/workout.model';

@Component({
  selector: 'app-workout-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './workout-create.component.html',
  styleUrl: './workout-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutCreateComponent implements OnInit {
  private workoutService = inject(WorkoutService);
  private classificationService = inject(ClassificationService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private createTrigger = new Subject<CreateWorkoutDto>();

  statuses = signal<ContentStatus[]>([]);
  submitting = signal(false);

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    estimatedTime: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    statusId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    this.createTrigger
      .pipe(
        switchMap((dto) => {
          this.submitting.set(true);
          return this.workoutService.createWorkout(dto);
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
    this.classificationService
      .getContentStatuses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((statuses) => this.statuses.set(statuses));
  }

  onSubmit() {
    if (this.form.invalid) return;

    const dto: CreateWorkoutDto = {
      name: this.form.value.name!,
      description: this.form.value.description || undefined,
      estimatedTime: this.form.value.estimatedTime!,
      statusId: this.form.value.statusId!,
    };

    this.createTrigger.next(dto);
  }

  onCancel() {
    this.router.navigate(['/workouts']);
  }
}
