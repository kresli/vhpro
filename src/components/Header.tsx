import {
  faHome,
  faCaretRight,
  faBuilding,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "./logo.svg";

export const Header = () => {
  return (
    <div className="bg-green-200 h-20 flex flex-row items-center">
      <img src={logo} alt="logo" />
      <FontAwesomeIcon icon={faHome} className="text-3xl" />
      <FontAwesomeIcon icon={faCaretRight} className="text-3xl" />
      <FontAwesomeIcon icon={faBuilding} className="text-3xl" />
      <FontAwesomeIcon icon={faCaretRight} className="text-3xl" />
      <FontAwesomeIcon icon={faBook} className="text-3xl" />
    </div>
  );
};
