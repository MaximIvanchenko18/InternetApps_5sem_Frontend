import { Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import { Main, AllCargo, CargosTable, CargoInfo, CargoEdit, AllFlights, FlightInfo, Authorization, Registration } from './pages'

function App() {

  return (
    <div className='d-flex flex-column vh-100'>
      <NavigationBar />
      <div className='container-xl d-flex flex-column px-2 px-sm-3 flex-grow-1'>
        <Routes>
          <Route path="/" element={<Main />} />

          <Route path="/cargo" element={<AllCargo />} />
          <Route path="/cargo/edit" element={<CargosTable />} />
          <Route path="/cargo/:cargo_id" element={<CargoInfo />} />
          <Route path="/cargo/edit/:cargo_id" element={<CargoEdit />} />

          <Route path="/flights" element={<AllFlights />} />
          <Route path="/flights/:flight_id" element={<FlightInfo />} />

          <Route path="/registration" element={<Registration />} />
          <Route path="/authorization" element={<Authorization />} />
        </Routes>
      </div>
    </div>
  )
}

export default App