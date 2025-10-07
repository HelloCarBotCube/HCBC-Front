import List from "../component/List";
import Random from "../component/Random";
import "./index.css";

export default function Main() {
  return (
    <div className="main-page">
      <div className="chat-list-section">
        <List />
      </div>
      <div className="random-match-section">
        <Random />
      </div>
    </div>
  );
}
