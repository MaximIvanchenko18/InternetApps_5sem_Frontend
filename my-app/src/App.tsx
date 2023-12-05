import './App.css'
import { Routes, Route, Navigate  } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import { AllCargo } from './pages/AllCargo'
import { CargoInfo } from './pages/CargoInfo'
import { AllFlights } from './pages/AllFlights'

function App() {
  return (
    <>
      <div className='container-xl px-2 px-sm-3'>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Navigate to="cargo" />} />
        <Route path="/cargo" element={<AllCargo />} />
        <Route path="/cargo/:cargo_id" element={<CargoInfo />} />
        <Route path="/flights" element={<AllFlights />} />
      </Routes>
      </div>
    </>
  )
}

export default App