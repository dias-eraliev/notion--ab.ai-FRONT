import HomeworkPage from "./pages/homework/HomeworkPage";
import PaymentsPage from "./pages/payments/PaymentsPage";
import { Route, Routes, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/homework/:homeworkId" element={<HomeworkPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
