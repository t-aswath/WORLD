"use client";

import { useAuthContext } from "@/utils/store";
import HeadImg  from "@/public/head.png";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useLogout from "@/hooks/useLogout";


export default function NavBar() {
  const { auth } = useAuthContext();

  return (
    <section className="flex items-center justify-between w-full fixed top-0 p-8 font-mono">
      <Link href='/' className="font-bold text-2xl">THE WORLD</Link>
      <span className="flex flex-row font-mono items-center">
			<Image src={HeadImg} alt="head" width={175} height={175} className="mr-10" />
        {auth ? (
          <Profile />
        ) : (
          <>
            <Link className="text-[#AC9EFF] hover:underline" href="/login">
              Login
            </Link>
            <Link className="pl-5 hover:underline" href="/signup">
              Sign Up
            </Link>
          </>
        )}
      </span>
    </section>
  );
}

function Profile() {
  const { auth } = useAuthContext();
  const logout = useLogout();
  return (
    <section className="flex items-center justify-center space-x-5">
      <DropdownMenu>
        <Link href={`/${auth?.type === 'INS' ? "institution" : "staff" }/admin`} className="hover:underline underline-offset-2">{auth?.name}</Link> 
        <DropdownMenuTrigger><h1 className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full">{auth?.name[0]}</h1></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem><Link href={`/${auth?.type === 'INS' ? "institution" : "staff" }/admin`}>Go To Profile</Link></DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-red-500" onClick={() => logout()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}
