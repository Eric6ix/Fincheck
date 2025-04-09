import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1 className="text-2xl text-center mt-10">FinCheck Frontend 🚀</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
