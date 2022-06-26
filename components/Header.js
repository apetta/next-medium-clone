import Image from "next/image";
import Link from "next/link";
import logo from "/public/medium-logo.png";

function Header() {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex items-center space-x-5">
        <div className="w-44 cursor-pointer">
          <Link href="/" passHref>
            <a>
              <Image src={logo} alt="logo" objectFit="contain" />
            </a>
          </Link>
        </div>
        <div className="hidden md:inline-flex space-x-5 items-center">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="text-white bg-green-600 px-4 py-1 rounded-full">
            Follow
          </h3>
        </div>
      </div>
      <div className="flex items-center space-x-5 text-green-600">
        <h3>Sign In</h3>
        <h3 className="border border-green-600 px-4 py-1 rounded-full hover:bg-green-600 hover:text-white cursor-not-allowed">
          Get Started
        </h3>
      </div>
    </header>
  );
}
export default Header;
