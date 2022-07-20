import { Dombyra } from "./components/dombyra";
import {Routes, Route} from "react-router-dom";
import { Footer } from "./components/Footer/footer";
import { Prima } from "./components/prima";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dombyra/>}/>
        <Route path="/qobyz" element={<Prima/>}/>
        {/* <Route path="/qyl-qobyz" element={<Qobyz/>}/> */}
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
