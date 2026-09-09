import versaceLogo from "../../assets/images/Group.png";
import zaraLogo from "../../assets/images/zara-logo-1 1.png";
import gucciLogo from "../../assets/images/gucci-logo-1 1.png";
import pradaLogo from "../../assets/images/prada-logo-1 1.png";
import calvinKleinLogo from "../../assets/images/Group (1).png";

const brands = [
  { img: versaceLogo, name: "Versace" },
  { img: zaraLogo, name: "Zara" },
  { img: gucciLogo, name: "Gucci" },
  { img: pradaLogo, name: "Prada" },
  { img: calvinKleinLogo, name: "Calvin Klein" },
];

const BrandsStrip = () => {
  return (
    <section className="brands-strip" id="brands" aria-label="Featured brands">
      <div className="brands-container">
        {brands.map((b) => (
          <img key={b.name} src={b.img} alt={b.name} className="brand-logo" />
        ))}
      </div>
    </section>
  );
};

export default BrandsStrip;
