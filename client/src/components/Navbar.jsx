import { NavLink } from "react-router-dom";
import logo from "../assets/images/Logo.png";
const Navbar = () => {
    return (
        <div className="flex items-center justify-between py-5 font-medium">
            <img src={logo} alt="brand Logo" className="w-36" />
            <ul className="flex gap-3">
                <NavLink to="/" className="flex flex-col items-center gap-1"><p className="dropdown-menu right-0">Shop</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                </NavLink>
                <NavLink to="/sale" className="flex flex-col items-center gap-1"><p>On sale</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                </NavLink>
                <NavLink to="/new-arrivals" className="flex flex-col items-center gap-1"><p>New Arrivals</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                </NavLink>
                <NavLink to="/brands" className="flex flex-col items-center gap-1"><p>Brands</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                </NavLink>
            </ul>
        </div>
    )
}

export default Navbar