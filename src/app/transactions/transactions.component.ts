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
  // --- לוגיקה לזיהוי סביבה ---
  private isLocal = window.location.hostname === 'localhost';
  private BASE_URL = this.isLocal 
    ? 'http://localhost:3003' 
    : 'https://transaction-history-backend-91c1.onrender.com';
  
  private apiUrl = `${this.BASE_URL}/api/transactions`;
  private stocksUrl = `${this.BASE_URL}/api/stocks`;
  // ---------------------------

  transactions: any[] = [];
  statusMessage: string | null = null;
  statusType: 'success' | 'error' = 'success';
  
  isEditing: boolean = false;
  editingId: number | null = null;

  allStocks: any[] = [];
  filteredStocks: any[] = [];
  showDropdown: boolean = false;

  newTransaction = {
    stock: { ticker: '' },
    operation: { operationId: 1 },
    shares: null as number | null,
    price: null as number | null
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchTransactions();
    this.loadAllStocks();
  }

  loadAllStocks(): void {
    this.http.get<any[]>(this.stocksUrl).subscribe(data => {
      this.allStocks = data;
      this.filteredStocks = data;
    });
  }

  // ... (שאר המתודות נשארות ללא שינוי, הן משתמשות ב-this.apiUrl ו-this.stocksUrl)
  
  filterStocks(event: any): void {
    const value = event.target.value.toUpperCase();
    this.filteredStocks = this.allStocks
      .filter(s => s.ticker.toUpperCase().startsWith(value))
      .slice(0, 10);
    this.showDropdown = true;
  }

  selectStock(s: any): void {
    this.newTransaction.stock.ticker = s.ticker;
    this.showDropdown = false;
  }

  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  fetchTransactions(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.transactions = data);
  }

  showStatus(msg: string, type: 'success' | 'error') {
    this.statusMessage = msg;
    this.statusType = type;
    setTimeout(() => this.statusMessage = null, 3000);
  }

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

  saveTrade(): void {
    const payload = {
      stock: { ticker: this.newTransaction.stock.ticker },
      operation: { operationId: Number(this.newTransaction.operation.operationId) },
      shares: Number(this.newTransaction.shares),
      price: Number(this.newTransaction.price)
    };

    if (this.isEditing && this.editingId) {
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

  tickerSearch: string = '';

  searchByTicker(): void {
    if (!this.tickerSearch.trim()) {
      this.fetchTransactions();
      return;
    }
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

  resetSearch(): void {
    this.tickerSearch = '';
    this.fetchTransactions();
  }
}