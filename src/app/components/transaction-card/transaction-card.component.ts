import {Component, Input} from '@angular/core';
import Transaction from "../../models/transaction";

@Component({
  selector: 'app-transaction-card',
  imports: [],
  templateUrl: './transaction-card.component.html',
  styleUrl: './transaction-card.component.css',
})
export class TransactionCardComponent {

  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'September', 'October', 'November', 'December'];

  @Input({required: true}) transaction!: Transaction;

}
