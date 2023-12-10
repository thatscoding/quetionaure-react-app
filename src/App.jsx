import { Route, Routes } from "react-router-dom";
import AddQuestion from "./pages/AddQuestion";
import EditQuestion from "./pages/EditQuestion";
import Questions from "./pages/Questions";

function App() {
  return (
    <div>
      <Routes>
        <Route index element={<Questions />} />
        <Route path="/add-question" element={<AddQuestion />} />
        <Route path="/edit-question/:id" element={<EditQuestion />} />
        <Route path="*" element={<h1>No page found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
