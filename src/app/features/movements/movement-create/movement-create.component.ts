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
import { MovementService } from '../../../core/services/movement.service';
import { ClassificationService } from '../../../core/services/classification.service';
import { ContentStatus } from '../../../core/models/classification.model';
import { CreateMovementDto } from '../../../core/models/movement.model';

@Component({
  selector: 'app-movement-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './movement-create.component.html',
  styleUrl: './movement-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementCreateComponent implements OnInit {
  private movementService = inject(MovementService);
  private classificationService = inject(ClassificationService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private createTrigger = new Subject<CreateMovementDto>();

  statuses = signal<ContentStatus[]>([]);
  submitting = signal(false);

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    statusId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    this.createTrigger
      .pipe(
        switchMap((dto) => {
          this.submitting.set(true);
          return this.movementService.createMovement(dto);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/movements']);
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

    const dto: CreateMovementDto = {
      name: this.form.value.name!,
      description: this.form.value.description || undefined,
      statusId: this.form.value.statusId!,
    };

    this.createTrigger.next(dto);
  }

  onCancel() {
    this.router.navigate(['/movements']);
  }
}
