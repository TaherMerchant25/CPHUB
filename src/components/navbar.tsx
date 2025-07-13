import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { VscGithub } from "react-icons/vsc";
import { ModeToggle } from "./ui/mode-toggle";

const Navbar = () => {
  return (
    <header className="w-full border-b bg-background sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">
            <div className="rounded-md border px-2 py-1">H</div>
          </Link>
          <h1>Hades</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button className="text-sm font-medium">
            <Link
              href={"//github.com/YadlaMani/hades"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <VscGithub className="w-8 h-8" />
            </Link>
          </Button>

          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
