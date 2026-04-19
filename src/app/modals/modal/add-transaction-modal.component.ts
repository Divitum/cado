import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import supabase from "../../services/supabase";
import {TransactionService} from "../../services/transaction-service";
import {FormsModule} from "@angular/forms";
import {AuthorizationService} from "../../services/authorization.service";
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-modal',
  templateUrl: './add-transaction-modal.component.html',
  styleUrls: ['./add-transaction-modal.component.scss'],
  imports: [
    FormsModule,
    MatCard,
    MatButton,
    MatInput
  ]
})
export class AddTransactionModalComponent {

  transactionService: TransactionService = inject(TransactionService);
  authorizationService: AuthorizationService = inject(AuthorizationService);

  @ViewChild('myModal', {static: false}) modal!: ElementRef;

  description: string = '';
  category: string = '';
  amount: number = 0;


  open() {
    this.modal.nativeElement.style.display = 'block';
  }

  close() {
    this.modal.nativeElement.style.display = 'none';
  }

  saveTransaction() {
    this.authorizationService.getLoggedInUserId()
      .then(id => {
        supabase.from('transactions').insert({
          'description': this.description,
          'amount': this.amount,
          'category': this.category,
          'user_id': id
        })
        .then(() => this.transactionService.fetchTransactions());
    })
    this.close();
  }
}
