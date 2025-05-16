import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Transaction } from './types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  historyExpanded: boolean;
  onToggleExpand: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  historyExpanded,
  onToggleExpand
}) => {
  return (
    <div className="bg-gray-800 rounded-md shadow-md overflow-hidden border border-gray-700">
      <div 
        className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={onToggleExpand}
      >
        <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Transaction History</h2>
        <div className={`transform transition-transform ${historyExpanded ? 'rotate-180' : ''} text-cyan-400`}>▲</div>
      </div>
      
      {historyExpanded && (
        <div className="p-3">
          <div className="grid grid-cols-5 font-bold mb-2 text-gray-300 border-b border-gray-700 pb-2">
            <div>From</div>
            <div>To</div>
            <div>Token ID</div>
            <div>Status</div>
            <div>Time</div>
          </div>
          
          {transactions.map(tx => (
            <div key={tx.id} className="grid grid-cols-5 py-2 border-t border-gray-700">
              <div>{tx.from}</div>
              <div>{tx.to}</div>
              <div>{tx.tokenId}</div>
              <div>
                {tx.status === 'success' ? (
                  <span className="flex items-center text-green-400">
                    <CheckCircle className="h-4 w-4 mr-1" /> Success
                  </span>
                ) : (
                  <span className="flex items-center text-pink-500">
                    <AlertCircle className="h-4 w-4 mr-1" /> Failed
                  </span>
                )}
              </div>
              <div>{tx.timestamp}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};