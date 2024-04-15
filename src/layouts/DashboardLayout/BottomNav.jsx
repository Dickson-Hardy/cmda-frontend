import { useNavigate } from "react-router-dom";

const BottomNav = ({ navLinks }) => {
  const navigate = useNavigate();

  return (
    <div className="block md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-primary shadow-lg">
      <nav className="grid h-full w-full grid-cols-5 mx-auto font-medium">
        {navLinks.map((item) => (
          <button
            key={item.title}
            type="button"
            className="inline-flex flex-col justify-center items-center gap-1 px-4 transition-all hover:bg-white text-white hover:text-primary truncate"
            onClick={() => navigate(item.link)}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs truncate">{item.title?.split(" ")[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
