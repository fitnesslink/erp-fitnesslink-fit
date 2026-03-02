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
import { ProgramService } from '../../../core/services/program.service';
import { ClassificationService } from '../../../core/services/classification.service';
import { ContentStatus } from '../../../core/models/classification.model';
import { CreateProgramDto } from '../../../core/models/program.model';

@Component({
  selector: 'app-program-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './program-create.component.html',
  styleUrl: './program-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramCreateComponent implements OnInit {
  private programService = inject(ProgramService);
  private classificationService = inject(ClassificationService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private createTrigger = new Subject<CreateProgramDto>();

  statuses = signal<ContentStatus[]>([]);
  submitting = signal(false);

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    estimatedTime: new FormControl<number | null>(null),
    statusId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    this.createTrigger
      .pipe(
        switchMap((dto) => {
          this.submitting.set(true);
          return this.programService.createProgram(dto);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/programs']);
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

    const dto: CreateProgramDto = {
      name: this.form.value.name!,
      description: this.form.value.description || undefined,
      estimatedTime: this.form.value.estimatedTime || undefined,
      statusId: this.form.value.statusId!,
    };

    this.createTrigger.next(dto);
  }

  onCancel() {
    this.router.navigate(['/programs']);
  }
}
