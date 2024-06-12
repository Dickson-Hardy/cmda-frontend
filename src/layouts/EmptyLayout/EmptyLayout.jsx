import { Link, Outlet } from "react-router-dom";
import Button from "~/components/Global/Button/Button";
import Logo from "~/components/Global/Logo/Logo";

const EmptyLayout = () => {
  return (
    <div>
      <header className="w-full p-4 flex items-center justify-center">
        <nav className="max-w-screen-xl w-full flex items-center gap-4 sm:gap-6">
          <Logo className="h-12 object-contain sm:h-auto" />
          <Link to="/login" className="ml-auto font-semibold text-sm text-primary hover:underline">
            Login
          </Link>
          <Link to="/signup">
            <Button variant="outlined" className="px-[12px] sm:px-8" label="Get Started" />
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default EmptyLayout;
