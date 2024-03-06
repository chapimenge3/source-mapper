import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-4 py-6 bg-white shadow">
      <Link className="text-xl font-bold tracking-wider text-gray-900 dark:text-gray-100" href="#">
        <FlagIcon className="h-6 w-6" />
        <span className="sr-only">Logo</span>
      </Link>
      <nav className="space-x-4">
        <Button className="shadow" variant="outline">
          <Link className="text-gray-700 dark:text-gray-300" href="#">
            Home
          </Link>
        </Button>
        <Button className="shadow" variant="outline">
          <Link className="text-gray-700 dark:text-gray-300" href="#">
            Services
          </Link>
        </Button>
        <Button className="shadow" variant="outline">
          <Link className="text-gray-700 dark:text-gray-300" href="#">
            About
          </Link>
        </Button>
        <Button className="shadow" variant="outline">
          <Link className="text-gray-700 dark:text-gray-300" href="#">
            Contact
          </Link>
        </Button>
      </nav>
    </header>
  )
}

function FlagIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  )
}
