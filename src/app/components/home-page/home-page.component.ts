import {Component, computed, inject, OnInit, signal, ViewChild} from '@angular/core';
import {AddTransactionModalComponent} from "../../modals/modal/add-transaction-modal.component";
import {HttpClient} from "@angular/common/http";
import supabase from "../../services/supabase"
import {TransactionService} from "../../services/transaction-service";
import {TransactionCardComponent} from "../transaction-card/transaction-card.component";
import {AuthorizationService} from "../../services/authorization.service";


@Component({
  selector: 'app-home',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.scss'],
  imports: [AddTransactionModalComponent, TransactionCardComponent]
})
export default class HomePage implements OnInit {
  http = inject(HttpClient);
  transactionService: TransactionService = inject(TransactionService);
  authorizationService: AuthorizationService = inject(AuthorizationService);
  transactions = this.transactionService.transactions;
  spendAmount = this.transactionService.spendAmount;
  localSpendAmount: number = 0;

  totalSpent = computed<number>(() => {
    return this.transactionService.transactions()
    .reduce((acc, t) => acc + t.amount, 0);
  });

  percentageSpent = computed<number>(() => {
    if (this.totalSpent() > 0 && this.spendAmount() > 0) {
      let spentPercentage = (this.totalSpent() / this.spendAmount()) * 100;
      return Math.floor(spentPercentage);
    } else {
      return 0;
    }
  })

  isSpendModalOpen = signal(false);
  startOfWeek: string = "";
  endOfWeek: string = "";
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'September', 'October', 'November', 'December'];
  username = signal<string>('');

  constructor() {
    console.log("HOME PAGE CONSTRUCTED")
    this.transactionService.fetchTransactions();
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    sunday.setHours(0, 0, 0, 0); // Optional: Reset to start of day
    const diff = 6 - now.getDay();
    const saturday = new Date(now);
    saturday.setDate(now.getDate() + diff);
    saturday.setHours(23, 59, 59, 99);
    this.startOfWeek = sunday.getDate() + ' ' + this.months[sunday.getMonth()];
    this.endOfWeek = saturday.getDate() + ' ' + this.months[saturday.getMonth()];
  }

  async ngOnInit() {
    let data = await this.getLoggedInUserName();
    this.username.set(data);
  }

  @ViewChild('modal', {static: false}) modal!: AddTransactionModalComponent;

  openModal() {
    this.modal.open();
  }
  protected readonly open = open;

  updateSpendAmount() {
    if (this.localSpendAmount > 0 && this.localSpendAmount !== this.spendAmount()) {
      this.transactionService.updateSpendAmount(this.localSpendAmount);
      this.localSpendAmount = 0;
    }
  }

  onSpendInput(spendAmount: string) {
    this.localSpendAmount = parseInt(spendAmount);
  }

  openSpendModal() {
    this.isSpendModalOpen.set(true);
  }

  closeAndSaveSpendAmount() {
    this.updateSpendAmount();
    this.isSpendModalOpen.set(false);
  }

  async getLoggedInUserName() {
    const user = await this.authorizationService.getLoggedInUser();
    return user?.user_metadata?.['name'];
  }
}
