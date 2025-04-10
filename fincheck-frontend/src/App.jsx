import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
// ... outras imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* depois você adiciona: <Route path="/register" ... /> */}
      </Routes>
    </Router>
  )
}
export default App