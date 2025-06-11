import {fetchWalletUserInfo} from "../services/users.js";
const calculateSummaryUtils = async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); 

  try {
    const walletUser = await fetchWalletUserInfo();
     const wallet = walletUser.wallet;
   
    const entry = data
      .filter((t) => t.type === "Entry")
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    const outlet = data
      .filter((t) => t.type === "Outlet")
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    
    return { entry, outlet, wallet };

  } catch (err) {

    console.error("Error calculating summary:", err.message);
    return { entry: 0, outlet: 0, wallet: 0 };
  }
};

export default calculateSummaryUtils;

