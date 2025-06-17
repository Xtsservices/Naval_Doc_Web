import React, { useState, useEffect, useCallback } from 'react';
import UserHeader from '../../userModule/userComponents/UserHeader';
import { BASE_URL } from "../../constants/api";


// Type definitions
interface Transaction {
  type: string;
  amount: string | number;
  reference: string | number;
  date: string;
  id?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface WalletBalanceResponse {
  balance?: number;
  walletAmount?: number;
  amount?: number;
  data?: {
    walletBalance?: number;
  };
  message?: string;
}

interface WalletTransactionsResponse {
  transactions?: Transaction[];
  data?: {
    transactions?: Transaction[];
  };
  message?: string;
}

const API_BASE_URL = `${BASE_URL}/order`;

const Wallet = () => {
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(true);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);

  // Fetch wallet balance
  const fetchWalletBalance = useCallback(async (): Promise<void> => {
    try {
      setBalanceLoading(true);
      const token = localStorage.getItem('Token') || localStorage.getItem('authorization');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/getWalletBalance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WalletBalanceResponse = await response.json();
      console.log('Wallet Balance Response:', data);

      // Extract wallet balance from response
      const balance = data.data?.walletBalance || 0;
      setWalletAmount(balance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setError('Failed to fetch wallet balance.');
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  // Fetch wallet transactions
  const fetchWalletTransactions = useCallback(async (): Promise<void> => {
    try {
      setTransactionsLoading(true);
      const token = localStorage.getItem('Token') || localStorage.getItem('authorization');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/getWalletTransactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WalletTransactionsResponse = await response.json();
      console.log('Wallet Transactions Response:', data);

      // Extract transactions from response
      const transactionsData = data.data?.transactions || [];

      // Format transactions to match expected structure
      const formattedTransactions = transactionsData.map((transaction) => ({
        type: transaction.type || 'credit',
        amount: `₹${transaction.amount}`,
        reference: transaction.reference || transaction.id || 'N/A',
        date: transaction.createdAt && typeof transaction.createdAt === 'number'
          ? new Date(transaction.createdAt * 1000).toLocaleDateString()
          : 'Invalid Date',
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
      setError('Failed to fetch wallet transactions...');
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      await Promise.all([fetchWalletBalance(), fetchWalletTransactions()]);

      setLoading(false);
    };

    fetchData();
  }, [fetchWalletBalance, fetchWalletTransactions]);

  // Refresh data
  const handleRefresh = () => {
    fetchWalletBalance();
    fetchWalletTransactions();
  };

  // Format amount for display
  const formatAmount = (amount: string | number): string => {
    if (typeof amount === 'string' && amount.startsWith('₹')) {
      return amount;
    }
    return `₹${amount}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #0000FF',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px',
            }}
          ></div>
          <p>Loading wallet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '0' }}>
      {/* Add CSS for spinner animation and styling */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .refresh-button {
          background-color: #0000FF;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          margin-left: 10px;
        }
        .refresh-button:hover {
          background-color: #0000CC;
        }
        .error-message {
          background-color: #ffe6e6;
          color: #d00;
          padding: 10px;
          border-radius: 5px;
          margin: 20px;
          border: 1px solid #ffcccc;
        }
        .loading-text {
          color: #666;
          font-style: italic;
        }
        .wallet-container {
          background-color: white;
          margin: 0;
          padding: 0;
        }
        .wallet-header {
          background-color: #1a47c7;
          color: white;
          text-align: center;
          padding: 20px 0;
          margin: 0;
          font-size: 20px;
          font-weight: bold;
        }
        .wallet-amount-box {
          margin: 20px;
          padding: 20px;
          border: 2px solid #1a47c7;
          border-radius: 10px;
          background-color: white;
          text-align: center;
        }
        .wallet-amount-text {
          font-size: 28px;
          color: #1a47c7;
          font-weight: bold;
          margin: 0;
        }
        .transactions-section {
          padding: 0 20px 20px 20px;
        }
        .transactions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .transactions-title {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        .view-all-link {
          color: #1a47c7;
          text-decoration: none;
          font-size: 14px;
        }
        .transactions-table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .table-header {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #1a47c7;
        }
        .table-cell {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
          text-align: left;
        }
        .table-row:last-child .table-cell {
          border-bottom: none;
        }
        .credit-amount {
          color: #28a745;
          font-weight: 500;
        }
        .debit-amount {
          color: #dc3545;
          font-weight: 500;
        }
      `}</style>
 <UserHeader headerText='Wallet Screen'/>
      <div className="wallet-container">
       
        {/* Blue Header */}
        {/* <div className="wallet-header">
          Wallet Amount
          <button className="refresh-button" onClick={handleRefresh}>
            Refresh
          </button>
        </div> */}

        {/* Error Message
        {error && (
          <div className="error-message">
            {error}
            <button className="refresh-button" onClick={handleRefresh}>
              Retry
            </button>
          </div>
        )} */}

        {/* Wallet Amount Box */}
        <div className="wallet-amount-box">
          {balanceLoading ? (
            <span className="loading-text">Loading...</span>
          ) : (
            <div className="wallet-amount-text">₹ {walletAmount}</div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="transactions-section">
          <div className="transactions-header">
            <h3 className="transactions-title">Transactions</h3>
            <a href="#" className="view-all-link">View All</a>
          </div>

          {transactionsLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div
                style={{
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #1a47c7',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 10px',
                }}
              ></div>
              <span className="loading-text">Loading transactions...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <p style={{ margin: '0 0 15px 0', color: '#666' }}>No transactions found</p>
              <button className="refresh-button" onClick={handleRefresh}>
                Refresh
              </button>
            </div>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr className="table-header">
                  <th className="table-cell">Type</th>
                  <th className="table-cell">Amount</th>
                  <th className="table-cell">Order ID</th>
                  <th className="table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell" style={{ textTransform: 'capitalize' }}>
                      {transaction.type}
                    </td>
                    <td className={`table-cell ${transaction.type === 'credit' ? 'credit-amount' : 'debit-amount'}`}>
                      {formatAmount(transaction.amount)}
                    </td>
                    <td className="table-cell">{transaction.reference}</td>
                    <td className="table-cell">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
