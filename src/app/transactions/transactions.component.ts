import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainHeaderComponent } from '../components/main-header/main-header.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, MainHeaderComponent, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  statusMessage: string | null = null;
  statusType: 'success' | 'error' = 'success';
  
  // משתני מצב לעריכה
  isEditing: boolean = false;
  editingId: number | null = null;

  private apiUrl = 'http://localhost:3003/api/transactions';

  newTransaction = {
    stock: { ticker: '' },
    operation: { operationId: 1 },
    shares: null as number | null,
    price: null as number | null
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.transactions = data);
  }

  showStatus(msg: string, type: 'success' | 'error') {
    this.statusMessage = msg;
    this.statusType = type;
    setTimeout(() => this.statusMessage = null, 3000);
  }

  // לחיצה על כפתור Edit בטבלה
  editTrade(t: any): void {
    this.isEditing = true;
    this.editingId = t.transactionId;
    this.newTransaction = {
      stock: { ticker: t.stock.ticker },
      operation: { operationId: t.operation.operationId },
      shares: t.shares,
      price: t.price
    };
  }

  // פונקציה משולבת ל-POST או PUT
  saveTrade(): void {
    const payload = {
      stock: { ticker: this.newTransaction.stock.ticker },
      operation: { operationId: Number(this.newTransaction.operation.operationId) },
      shares: Number(this.newTransaction.shares),
      price: Number(this.newTransaction.price)
    };

    if (this.isEditing && this.editingId) {
      // עדכון קיים (PUT)
      this.http.put(`${this.apiUrl}/${this.editingId}`, payload).subscribe({
        next: () => {
          this.fetchTransactions();
          this.showStatus('Trade updated successfully!', 'success');
          this.resetForm();
        },
        error: (err) => {
          console.error('Error updating:', err);
          this.showStatus('Failed to update trade.', 'error');
        }
      });
    } else {
      // יצירה חדשה (POST)
      this.http.post(this.apiUrl, payload).subscribe({
        next: () => {
          this.fetchTransactions();
          this.showStatus('Trade added successfully!', 'success');
          this.resetForm();
        },
        error: (err) => {
          console.error('Error adding:', err);
          this.showStatus('Failed to add trade.', 'error');
        }
      });
    }
  }

  deleteTrade(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).subscribe({
      next: () => {
        this.fetchTransactions();
        this.showStatus('Trade deleted successfully!', 'success');
      },
      error: (err) => {
        console.error('Error deleting:', err);
        this.showStatus('Failed to delete trade.', 'error');
      }
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingId = null;
    this.newTransaction = {
      stock: { ticker: '' },
      operation: { operationId: 1 },
      shares: null,
      price: null
    };
  }

  // הוסף משתנה חדש במחלקה
tickerSearch: string = '';

// פונקציית חיפוש
searchByTicker(): void {
  if (!this.tickerSearch.trim()) {
    this.fetchTransactions();
    return;
  }
  
  // קריאה ל-API החדש שיצרנו: /search?ticker=...
  this.http.get<any[]>(`${this.apiUrl}/search?ticker=${this.tickerSearch}`).subscribe({
    next: (data) => {
      this.transactions = data;
    },
    error: (err) => {
      console.error('Error searching:', err);
      this.showStatus('No transactions found for this ticker.', 'error');
    }
  });
}

// פונקציית איפוס
resetSearch(): void {
  this.tickerSearch = '';
  this.fetchTransactions();
}
}