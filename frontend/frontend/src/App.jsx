import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Everything inside this route will use the Layout wrapper */}
        <Route path="/" element={<Layout />}>
          
          {/* This 'index' route renders when you are at "/" */}
          <Route index element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Welcome to the Home Feed!</h1>
            </div>
          } />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
