import api from "../services/api";

  const CalculateSummary = (transaction) => {
    const entry = transaction
      .filter((t) => t.type === "Entry")
      .reduce((acc, t) => acc + t.amount, 0);

    const outlet = transaction
      .filter((t) => t.type === "Outlet")
      .reduce((acc, t) => acc + t.amount, 0);

    const wallet = entry - outlet;

    setSummary({ outlet, entry, wallet });
  };

  export default CalculateSummary();