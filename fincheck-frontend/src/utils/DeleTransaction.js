  const handleDeleteTransaction = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (confirmed) {
      try {
        await deleteTransaction(id);
        setTransaction((prev) => prev.filter((tx) => tx.id !== id));
        fetchTransactionsUtil();
        setTransaction(updated);
        fetchCalculade(updated);
      } catch (error) {
        console.error("Erro when delet transaction:", error);
      }
    }
  };