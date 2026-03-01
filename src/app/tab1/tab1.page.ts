import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExpenseService, ExpenseGroup } from '../services/expense.service';
import { Expense } from '../models/expense.model';
import { ExpensePeriod } from '../models/expense.model';
import { AddExpenseModalComponent, AddExpenseResult } from '../modals/add-expense-modal/add-expense-modal.component';
import { AddTransactionModalComponent } from '../modals/add-transaction-modal/add-transaction-modal.component';
import { Subscription } from 'rxjs';

const WEEKS_PER_MONTH = 4.33;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  periodView: ExpensePeriod = 'monthly';
  expenseGroups: ExpenseGroup[] = [];
  private sub?: Subscription;

  constructor(
    private expenseService: ExpenseService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.refreshGroups();
    this.sub = this.expenseService.getExpensesObservable().subscribe(() => {
      this.refreshGroups();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  refreshGroups(): void {
    this.expenseGroups = this.expenseService.getExpensesGroupedByCategory();
  }

  onPeriodViewChange(): void {
    this.refreshGroups();
  }

  getDisplayAmount(expense: Expense): number {
    if (expense.type === 'realtime') {
      return expense.currentAmount;
    }
    const amount = expense.amount;
    if (expense.period === this.periodView) return amount;
    if (expense.period === 'weekly' && this.periodView === 'monthly') {
      return Math.round(amount * WEEKS_PER_MONTH * 100) / 100;
    }
    return Math.round((amount / WEEKS_PER_MONTH) * 100) / 100;
  }

  formatAmount(value: number): string {
    return '$' + (value ?? 0).toFixed(2);
  }

  onAmountChange(expense: Expense, value: number | string): void {
    if (expense.type !== 'recurring') return;
    const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
    let finalAmount = num;
    if (expense.period !== this.periodView) {
      if (expense.period === 'weekly' && this.periodView === 'monthly') {
        finalAmount = num / WEEKS_PER_MONTH;
      } else {
        finalAmount = num * WEEKS_PER_MONTH;
      }
    }
    this.expenseService.updateExpense(expense.id, { amount: finalAmount });
  }

  togglePaid(expense: Expense): void {
    if (expense.type !== 'recurring') return;
    this.expenseService.markRecurringPaid(expense.id, !expense.isPaid);
  }

  deleteExpense(expense: Expense): void {
    this.expenseService.deleteExpense(expense.id);
  }

  async openAddExpense(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddExpenseModalComponent,
      componentProps: {
        categories: this.expenseService.getCategories(),
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.expenseService.addExpense({
        name: data.name,
        categoryId: data.categoryId,
        amount: data.amount,
        period: data.period,
        type: data.type,
        isPaid: false,
        goalAmount: data.goalAmount ?? 0,
        currentAmount: 0,
      });
    }
  }

  async openAddTransaction(expense: Expense): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddTransactionModalComponent,
      componentProps: {
        expenseName: expense.name,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.amount != null && data.amount > 0) {
      this.expenseService.addTransaction(expense.id, data.amount);
    }
  }
}
