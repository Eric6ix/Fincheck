export function calculateBalance(transactions) {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === "income") {
        return acc + transaction.amount;
      } else if (transaction.type === "outcome") {
        return acc - transaction.amount;
      }
      return acc;
    }, 0);
  }
  