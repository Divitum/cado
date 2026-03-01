import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { AddExpenseModalComponent } from '../modals/add-expense-modal/add-expense-modal.component';
import { AddTransactionModalComponent } from '../modals/add-transaction-modal/add-transaction-modal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    AddExpenseModalComponent,
    AddTransactionModalComponent,
  ],
  declarations: [Tab1Page],
})
export class Tab1PageModule {}
