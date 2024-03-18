import { BrowserRouter, Routes, Route } from "react-router-dom";
import SubmissionForm from "./pages/SubmissionForm";
import SubmissionList from "./pages/SubmissionList";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SubmissionForm />} />
          <Route path="/submissions" element={<SubmissionList />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
