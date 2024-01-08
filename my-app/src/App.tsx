import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { AllCargo, CargoInfo, AllFlights, FlightInfo, Authorization, Registration } from './pages';
import NavigationBar from './components/NavigationBar';
import { AppDispatch } from "./store";
import { setLogin, setRole } from "./store/userSlice";
import AuthCheck, { CUSTOMER, MODERATOR } from './components/AuthCheck';

function App() {
  let exp_time = localStorage.getItem('expires_at')
  if (exp_time !== null && new Date(exp_time) <= new Date()) {
    localStorage.clear()
  }

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const login = localStorage.getItem('login');
    const role = localStorage.getItem('role');
    if (login && role) {
      dispatch(setLogin(login));
      dispatch(setRole(parseInt(role)));
    }
  }, [dispatch]);

  return (
    <div className='d-flex flex-column vh-100'>
      <NavigationBar />
      <div className='container-xl d-flex flex-column px-2 px-sm-3 flex-grow-1'>
        <Routes>
          <Route path="/" element={<Navigate to="/cargo" />} />
          <Route path="/cargo" element={<AllCargo />} />
          <Route path="/cargo/:cargo_id" element={<CargoInfo />} />

          <Route path="/flights" element={<AuthCheck allowedRoles={[CUSTOMER, MODERATOR]}><AllFlights /></AuthCheck>} />
          <Route path="/flights/:flight_id" element={<AuthCheck allowedRoles={[CUSTOMER, MODERATOR]}><FlightInfo /></AuthCheck>} />

          <Route path="/registration" element={<Registration />} />
          <Route path="/authorization" element={<Authorization />} />
        </Routes>
      </div>
    </div>
  )
}

export default App