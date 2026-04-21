'use client';

import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="bg-[#B9BFFF] text-white shadow-md">
            <div className="max-w-7xl mx-auto flex items-center px-6 py-4">
                
                {/* Logo */}
                <div className="flex items-center mr-10">
                    <Image
                        src="/images/logo.png"
                        alt="logo"
                        width={180}
                        height={120}
                        className="object-contain"
                    />
                </div>

                {/* Links */}
                <ul className="flex gap-6 text-lg font-medium">
                    <li>
                        <Link href="/" className="hover:text-gray-200 transition">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/info" className="hover:text-gray-200 transition">
                            Info
                        </Link>
                    </li>
                    <li>
                        <Link href="/discovery" className="hover:text-gray-200 transition">
                            Discover
                        </Link>
                    </li>
                    <li>
                        <Link href="/forum" className="hover:text-gray-200 transition">
                            Forum
                        </Link>
                    </li>
                </ul>

            </div>
        </nav>
    );
};

export default Navbar;