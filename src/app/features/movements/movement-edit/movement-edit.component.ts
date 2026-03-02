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
import { MovementService } from '../../../core/services/movement.service';
import { ClassificationService } from '../../../core/services/classification.service';
import { ContentStatus } from '../../../core/models/classification.model';
import { MovementDetail, UpdateMovementDto } from '../../../core/models/movement.model';

@Component({
  selector: 'app-movement-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './movement-edit.component.html',
  styleUrl: './movement-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementEditComponent implements OnInit {
  private movementService = inject(MovementService);
  private classificationService = inject(ClassificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private updateTrigger = new Subject<{ id: string; dto: UpdateMovementDto }>();

  statuses = signal<ContentStatus[]>([]);
  loading = signal(true);
  submitting = signal(false);
  movement = signal<MovementDetail | null>(null);

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    statusId: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    this.updateTrigger
      .pipe(
        switchMap(({ id, dto }) => {
          this.submitting.set(true);
          return this.movementService.updateMovement(id, dto);
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
    const id = this.route.snapshot.paramMap.get('id')!;

    this.classificationService
      .getContentStatuses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((statuses) => this.statuses.set(statuses));

    this.movementService
      .getMovement(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((movement) => {
        this.movement.set(movement);
        this.form.patchValue({
          name: movement.name,
          description: movement.description || '',
        });
        this.loading.set(false);
      });
  }

  onSubmit() {
    const m = this.movement();
    if (this.form.invalid || !m) return;

    const dto: UpdateMovementDto = {
      name: this.form.value.name || undefined,
      description: this.form.value.description || undefined,
      statusId: this.form.value.statusId || undefined,
    };

    this.updateTrigger.next({ id: m.id, dto });
  }

  onCancel() {
    this.router.navigate(['/movements']);
  }
}
