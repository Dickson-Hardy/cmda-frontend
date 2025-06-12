import { Link, Outlet } from "react-router-dom";
import Button from "~/components/Global/Button/Button";
import Logo from "~/components/Global/Logo/Logo";

const EmptyLayout = () => {
  return (
    <div>
      <header className="py-4 w-full flex items-center justify-center">
        <nav className="px-4 sm:px-8 xl:px-28 w-full flex items-center gap-3 sm:gap-6">
          <Logo className="h-11 object-contain sm:h-auto" />
          <Link to="/conferences" className="ml-auto font-semibold text-sm text-primary hover:underline">
            Conferences
          </Link>
          <Link to="/login" className="font-semibold text-sm text-primary hover:underline">
            Login
          </Link>
          <Link to="/signup">
            <Button variant="outlined" className="px-[8px] sm:px-8" label="Get Started" />
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
