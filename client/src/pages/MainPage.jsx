import "./MainPage.css";

export default function MainPage({ setPage }) {
  return (
    <div className="hero">
      <div className="heroText">
        <h1>Pets Finder</h1>
        <p>Browse adoptable pets, add listings, and see fun enrichment info.</p>

        <img
          src="https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg"
          alt="Pet"
          className="heroImg"
        />

        <div className="heroButtons">
          <button onClick={() => setPage("Pets")}>Start Finding</button>
          <button onClick={() => setPage("LogIn")}>Login</button>{" "}
        </div>
      </div>
    </div>
  );
}
