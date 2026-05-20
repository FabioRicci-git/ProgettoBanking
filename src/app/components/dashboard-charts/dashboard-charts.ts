import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankStore } from '../../app.state';

export interface BalanceChartPoint {
  label: string;
  balance: number;
  t: number;
}

/** Area disegno SVG (viewBox 0 0 100 40) con padding per centrare il grafico. */
const CHART = { l: 10, r: 10, t: 8, b: 10, w: 80, h: 22 };

@Component({
  standalone: true,
  selector: 'app-dashboard-charts',
  imports: [CommonModule],
  templateUrl: './dashboard-charts.html',
  styleUrl: './dashboard-charts.css',
})
export class DashboardCharts implements OnInit {
  protected readonly bank = inject(BankStore);

  readonly balanceSeries = computed((): BalanceChartPoint[] => {
    const txs = [...this.bank.transactions()].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    const points: BalanceChartPoint[] = [];
    for (const tx of txs) {
      if (tx.balanceAfter != null && Number.isFinite(tx.balanceAfter)) {
        points.push({
          t: tx.date.getTime(),
          balance: tx.balanceAfter,
          label: tx.date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
        });
      }
    }
    if (points.length === 0 && this.bank.balance() != null) {
      points.push({
        t: Date.now(),
        balance: this.bank.balance(),
        label: 'Oggi',
      });
    }
    return points;
  });

  private chartPoints(pts: BalanceChartPoint[]) {
    const ys = pts.map((p) => p.balance);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const pad = maxY === minY ? Math.max(maxY * 0.05, 1) : (maxY - minY) * 0.12;
    const lo = minY - pad;
    const hi = maxY + pad;
    const span = hi - lo || 1;
    const n = pts.length;
    return pts.map((p, i) => ({
      x: CHART.l + (n > 1 ? (i / (n - 1)) * CHART.w : CHART.w / 2),
      y: CHART.t + CHART.h - ((p.balance - lo) / span) * CHART.h,
    }));
  }

  readonly gridLinesY = computed(() => {
    const pts = this.balanceSeries();
    if (pts.length < 2) return [];
    const ys = pts.map((p) => p.balance);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const pad = maxY === minY ? Math.max(maxY * 0.05, 1) : (maxY - minY) * 0.12;
    const lo = minY - pad;
    const hi = maxY + pad;
    const span = hi - lo || 1;
    return [0.25, 0.5, 0.75].map((t) => {
      const val = lo + span * t;
      const y = CHART.t + CHART.h - ((val - lo) / span) * CHART.h;
      return y;
    });
  });

  readonly linePathD = computed(() => {
    const pts = this.balanceSeries();
    if (pts.length < 2) return '';
    const coords = this.chartPoints(pts);
    return coords
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
      .join(' ');
  });

  readonly areaPathD = computed(() => {
    const line = this.linePathD();
    if (!line) return '';
    const bottom = CHART.t + CHART.h;
    return `${line} L ${CHART.l + CHART.w} ${bottom} L ${CHART.l} ${bottom} Z`;
  });

  readonly chartDots = computed(() => {
    const pts = this.balanceSeries();
    if (pts.length < 2) return [];
    return this.chartPoints(pts);
  });

  readonly edgeLabels = computed(() => {
    const pts = this.balanceSeries();
    if (pts.length < 2) return null;
    return { start: pts[0].label, end: pts[pts.length - 1].label };
  });

  readonly depositWithdrawBars = computed(() => {
    const txs = this.bank.transactions();
    let dep = 0;
    let wit = 0;
    for (const t of txs) {
      if (t.type === 'deposit') dep += t.amount;
      else wit += t.amount;
    }
    const max = Math.max(dep, wit, 1);
    return {
      depositPct: (dep / max) * 100,
      withdrawPct: (wit / max) * 100,
      depositTotal: dep,
      withdrawTotal: wit,
    };
  });

  ngOnInit(): void {
    if (this.bank.transactions().length === 0) {
      this.bank.refreshFromApi().subscribe();
    }
  }
}
