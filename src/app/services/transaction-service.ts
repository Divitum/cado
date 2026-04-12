import {inject, Injectable, signal} from '@angular/core';
import Transaction from "../models/transaction";
import supabase from "./supabase";
import {PostgrestSingleResponse} from "@supabase/supabase-js";
import TransactionEntity from "../models/transaction-entity";
import {AuthorizationService} from "./authorization.service";

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private authorizationService: AuthorizationService = inject(AuthorizationService);
  private _transactions = signal<Transaction[]>([]);
  transactions = this._transactions.asReadonly();
  private _spendAmount = signal<number>(0);
  spendAmount = this._spendAmount.asReadonly();

  async fetchTransactions(){
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    sunday.setHours(0, 0, 0, 0); // Optional: Reset to start of day
    const diff = 6 - now.getDay();
    const saturday = new Date(now);
    saturday.setDate(now.getDate() + diff);
    saturday.setHours(23, 59, 59, 99);

    const userId = await this.authorizationService.getLoggedInUserId();

    supabase.from('transactions')
      .select()
      .eq('user_id', userId)
      .gt('creation_date', sunday.toISOString())
      .lt('creation_date', saturday.toISOString())
      .then((result: PostgrestSingleResponse<any>) => {
      let transactionsArray: Transaction[] = result?.data?.map((transaction: TransactionEntity) => (
        {
          description: transaction.description,
          amount: transaction.amount,
          date: new Date(transaction.creation_date),
          category: transaction.category
        }
      )).filter((t: Transaction) => t.amount != null);
      this._transactions.set(transactionsArray.sort((a,b) => +b.date - +a.date));
    });

    supabase.from('user_settings').select()
      .eq('user_id', userId)
      .single()
      .then((result: PostgrestSingleResponse<any>) => {
        this._spendAmount.set(result.data?.spend_amount ?? 1000);
    })
  }

  updateSpendAmount(spendAmount: number) {
    this.authorizationService.getLoggedInUserId()
      .then(id => {
        supabase.from('user_settings')
          .upsert({ user_id: id, spend_amount: spendAmount }, { onConflict: 'user_id'})
          .eq('user_id', id)
          .select()
          .single()
          .then((result: PostgrestSingleResponse<any>) => {
            this._spendAmount.set(result.data?.spend_amount);
          });
      });
  }
}
