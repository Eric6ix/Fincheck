
  const handleLogout = () => {
    alert("You have been logged out");
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  
<div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          logout
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Export PDF
        </button>
        <button
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Export CSV
        </button>
      </div>