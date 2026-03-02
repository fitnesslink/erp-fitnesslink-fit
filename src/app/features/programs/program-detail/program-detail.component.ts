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
import { ProgramService } from '../../../core/services/program.service';
import { ProgramDetail } from '../../../core/models/program.model';

@Component({
  selector: 'app-program-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './program-detail.component.html',
  styleUrl: './program-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramDetailComponent implements OnInit {
  private programService = inject(ProgramService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  program = signal<ProgramDetail | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.programService
      .getProgram(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (program) => {
          this.program.set(program);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onEdit() {
    const p = this.program();
    if (p) {
      this.router.navigate(['/programs', p.id, 'edit']);
    }
  }

  onBack() {
    this.router.navigate(['/programs']);
  }
}
