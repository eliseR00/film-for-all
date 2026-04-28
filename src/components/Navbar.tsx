'use client';

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Navbar = () => {
    const { data: session, status } = useSession();
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
                        <Link href="/discovery" className="hover:text-gray-200 transition">
                            Discover Random Film
                        </Link>
                    </li>
                    <li>
                        <Link href="/forum" className="hover:text-gray-200 transition">
                            Forum
                        </Link>
                    </li>
                    <li>
                        {status === 'loading' ? (
                            <span className="text-gray-300">Loading...</span>
                        ) : session ? (
                            <Link href="/user/profile" className="hover:text-gray-200 transition">
                                Profile
                            </Link>
                        ) : (
                            <Link href="/auth/signin" className="hover:text-gray-200 transition">
                                Sign In
                            </Link>
                        )}
                    </li>
                </ul>

            </div>
        </nav>
    );
};

export default Navbar;