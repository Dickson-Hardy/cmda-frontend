import { MdMenu, MdKeyboardArrowUp, MdClose, MdLogout, MdOutlineSettings } from "react-icons/md";
import { FiBell, FiDownloadCloud } from "react-icons/fi";
import { HiDotsVertical, HiOutlineHome } from "react-icons/hi";
import { FaPlus, FaMinus, FaCheck, FaCheckCircle, FaEye, FaEyeSlash, FaRegCalendarAlt } from "react-icons/fa";
import { AiOutlineDelete, AiOutlineFileText } from "react-icons/ai";
import {
  BsFileEarmarkImage,
  BsFiletypeDoc,
  BsFiletypePdf,
  BsFillFileEarmarkPdfFill,
  BsSortAlphaDownAlt,
  BsSortAlphaUp,
} from "react-icons/bs";
import { BiSortAlt2 } from "react-icons/bi";

const icons = {
  bell: <FiBell />,
  download: <FiDownloadCloud />,
  menu: <MdMenu />,
  verticalDots: <HiDotsVertical />,
  plus: <FaPlus />,
  minus: <FaMinus />,
  delete: <AiOutlineDelete />,
  doc: <BsFiletypeDoc />,
  image: <BsFileEarmarkImage />,
  file: <AiOutlineFileText />,
  pdf: <BsFillFileEarmarkPdfFill />,
  pdfAlt: <BsFiletypePdf />,
  check: <FaCheck />,
  checkAlt: <FaCheckCircle />,
  eye: <FaEye />,
  eyeSlash: <FaEyeSlash />,
  sort: <BiSortAlt2 />,
  ascending: <BsSortAlphaUp />,
  descending: <BsSortAlphaDownAlt />,
  arrowUp: <MdKeyboardArrowUp />,
  close: <MdClose />,
  logout: <MdLogout />,
  settings: <MdOutlineSettings />,
  home: <HiOutlineHome />,
  calendar: <FaRegCalendarAlt />,
};

export default icons;
