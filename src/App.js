import React from "react";
import MainPage from "./Pages/Admin/Main";
import Attendance from "./Pages/Admin/Attendance";
import Analytics from "./Pages/Admin/Analytics";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InProgress from "./Pages/Admin/InProgress";
import Students from "./Pages/Admin/Students";
import ManualAtt from "./Pages/Admin/ManualAtt";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/InProgress" element={<InProgress />} />
        <Route path="/students" element={<Students />} />
        <Route path="/manualAttendance" element={<ManualAtt />} />
      </Routes>
    </Router>
  );
}

export default App;
