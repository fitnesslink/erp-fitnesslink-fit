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
import { ProgramService } from '../../../core/services/program.service';
import { ClassificationService } from '../../../core/services/classification.service';
import { ContentStatus } from '../../../core/models/classification.model';
import { ProgramDetail, UpdateProgramDto } from '../../../core/models/program.model';

@Component({
  selector: 'app-program-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './program-edit.component.html',
  styleUrl: './program-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramEditComponent implements OnInit {
  private programService = inject(ProgramService);
  private classificationService = inject(ClassificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private updateTrigger = new Subject<{ id: string; dto: UpdateProgramDto }>();

  statuses = signal<ContentStatus[]>([]);
  loading = signal(true);
  submitting = signal(false);
  program = signal<ProgramDetail | null>(null);

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    estimatedTime: new FormControl<number | null>(null),
    statusId: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    this.updateTrigger
      .pipe(
        switchMap(({ id, dto }) => {
          this.submitting.set(true);
          return this.programService.updateProgram(id, dto);
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
    const id = this.route.snapshot.paramMap.get('id')!;

    this.classificationService
      .getContentStatuses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((statuses) => this.statuses.set(statuses));

    this.programService
      .getProgram(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((program) => {
        this.program.set(program);
        this.form.patchValue({
          name: program.name,
          description: program.description || '',
          estimatedTime: program.estimatedTime || null,
        });
        this.loading.set(false);
      });
  }

  onSubmit() {
    const p = this.program();
    if (this.form.invalid || !p) return;

    const dto: UpdateProgramDto = {
      name: this.form.value.name || undefined,
      description: this.form.value.description || undefined,
      estimatedTime: this.form.value.estimatedTime || undefined,
      statusId: this.form.value.statusId || undefined,
    };

    this.updateTrigger.next({ id: p.id, dto });
  }

  onCancel() {
    this.router.navigate(['/programs']);
  }
}
