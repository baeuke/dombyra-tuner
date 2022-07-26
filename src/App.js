import { Dombyra } from "./components/Dombyra/dombyra";
import {Routes, Route} from "react-router-dom";
import { Footer } from "./components/Footer/footer";
import { Prima } from "./components/Prima/prima";
import { Qobyz } from "./components/Qyl/qobyz";
import { Under } from "./components/temp/under";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dombyra/>}/>
        <Route path="/qobyz" element={<Under/>}/>
        <Route path="/prima-qobyz" element={<Under/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
