import React from "react";
import ThemeSwitcher from "./theme-switcher";
import { Home } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import LanguageSelector from "./language-selector";

const Header = () => {
  return (
    <header className={"relative h-16 justify-between"}>
      <div className="absolute top-0 right-0 -translate-x-6 translate-y-3">
        <ThemeSwitcher />
      </div>
      <div className="absolute top-0 right-0 -translate-x-20 translate-y-3">
        <LanguageSelector />
      </div>
      <div className="absolute top-0 left-0 translate-x-6 translate-y-3">
        <Link href={"/"}>
          <Button variant={"secondary"} size={"icon"}>
            <Home />
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
