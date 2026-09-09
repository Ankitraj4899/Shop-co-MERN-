import { Link } from "react-router-dom";
import casualImage from "../../assets/images/Frame 61.png";
import formalImage from "../../assets/images/Frame 62.png";
import partyImage from "../../assets/images/Frame 64.png";
import gymImage from "../../assets/images/Frame 63.png";

const DressStyleSection = () => {
  return (
    <section className="style-section" id="dress-styles">
      <h2>BROWSE BY DRESS STYLE</h2>
      <div className="style-grid">
        <div className="style-row">
          <Link
            to="/categories?style=Casual"
            className="style-card style-card--casual"
            aria-label="Casual dress style"
          >
            <img src={casualImage} alt="Casual style" />
          </Link>
          <Link
            to="/categories?style=Formal"
            className="style-card style-card--formal"
            aria-label="Formal dress style"
          >
            <img src={formalImage} alt="Formal style" />
          </Link>
        </div>
        <div className="style-row">
          <Link
            to="/categories?style=Party"
            className="style-card style-card--party"
            aria-label="Party dress style"
          >
            <img src={partyImage} alt="Party style" />
          </Link>
          <Link
            to="/categories?style=Gym"
            className="style-card style-card--gym"
            aria-label="Gym dress style"
          >
            <img src={gymImage} alt="Gym style" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DressStyleSection;
