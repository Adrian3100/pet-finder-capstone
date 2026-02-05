import { useState } from "react";
import PetsPage from "./pages/PetsPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
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
  let content = <MainPage setPage={setPage}/>
   if (page===('Main')) {
    content = <MainPage setPage={setPage}/>
   } else if (page===('Pets')) {
    content = <PetsPage setPage={setPage}/>
   }
   else if (page==='LogIn') {
    content = <LogInPage setPage={setPage}/>
   }
  return <div>
    <h1>
        Pets
    </h1>
    <nav>
        <button onClick={GoToPets}>Pets</button>
        <button onClick={GoToMain}>Main</button>
        <button onClick={GoToLogIn}>LogIn</button>
    </nav>
    {content}
    </div>;
}