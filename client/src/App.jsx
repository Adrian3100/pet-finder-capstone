import { useState } from "react";
import PetsPage from "./pages/PetsPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import InsightsPage from "./pages/InsightsPage.jsx";
import "./App.css";
export default function App() {
  const [page,setPage] = useState("Main")
   function GoToPets() {
     setPage('Pets');
   }
   function GoToMain() {
    setPage('Main');
   }
   function GoToLogIn() {
    setPage('LogIn');
   }
   function GoToInsights() {
    setPage('Insights');
   }
  let content = <MainPage setPage={setPage}/>
   if (page===('Main')) {
    content = <MainPage setPage={setPage}/>
   } else if (page===('Pets')) {
    content = <PetsPage setPage={setPage}/>
   }
   else if (page==='LogIn') {
    content = <LogInPage setPage={setPage}/>
   }
   else if (page === "Insights") {
    content = <InsightsPage setPage={setPage}/>
   }
  return <div>
    <h1>
        Pets
    </h1>
    <nav>
        <button className="petButton" onClick={GoToPets}>Pets</button>
        <button className="mainButton" onClick={GoToMain}>Main</button>
        <button className="loginButton" onClick={GoToLogIn}>LogIn</button>
    </nav>
    {content}
    </div>;
}