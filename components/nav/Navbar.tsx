'use client';

import Link from 'next/link';
import { AuthNav } from './AuthNav';

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Marble
            </Link>
          </div>
          <div className="flex items-center ml-auto">
            <AuthNav />
          </div>
        </div>
      </div>
    </nav>
  );
} 