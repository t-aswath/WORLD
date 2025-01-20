'use client'

import axios from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation'
import Link from "next/link";

const InstitutionSignUp = z.object({
  name: z.string({required_error: "Name is required", invalid_type_error: "Name must be a string", }).min(6).max(50),
  phone_number: z.string({required_error: "phone number is required"}).length(10),
  mail: z.string({required_error: "mail is required"}).email(),
  website: z.string({required_error: "website is required"}).url(),
  password: z.string({required_error: "password is required"}).max(25, "Password too long - should be atmost 25 characteres").min(8, "Password too short - should be 8 chars minimum")
}).extend({ confirm_password: z.string(), })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password Must Match",
    path: ["confirm_password"],
  })

export default function SignUp() {
  const router = useRouter()

  type TInstitutionSignup = z.infer<typeof InstitutionSignUp>;
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<TInstitutionSignup>({
    resolver: zodResolver(InstitutionSignUp)
  });
  const onSubmit = async (data: TInstitutionSignup) => {
    try {
      const response = await axios.post("/api/v1/auth/institute/signup", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      if (response.statusText === "OK") return router.push('/login');
    } catch (e) {
      setError("root", {
        type: "server",
        message: "Somthing With The Server",
      });
    }
  };

  return (
    <main className="flex items-center w-full min-h-screen p-2">
        <form className="flex flex-col items-center space-y-3 w-full" onSubmit={handleSubmit(onSubmit)} >
          <h1 className="text-5xl font-bold">Welcome to WORLD</h1>
				<p className="text-xl"> Register your Institution to get started</p>
          <input 
            {...register("name")}
            className={`${errors.name && "shadow-red-500" } w-1/4 rounded border border-[#9888FF] focus:outline-none p-5 bg-[#ECECFF] text-xl`}
            placeholder="Institution Name" 
          />
          <input 
            {...register("website")}
            className={`${errors.name && "shadow-red-500" } w-1/4 rounded border border-[#9888FF] focus:outline-none p-5 bg-[#ECECFF] text-xl`}
            placeholder="Official Website" 
          />
          <input 
            {...register("mail")}
            className={`${errors.name && "shadow-red-500" } w-1/4 rounded border border-[#9888FF] focus:outline-none p-5 bg-[#ECECFF] text-xl`}
            placeholder="Instution Email" 
          />
          <input 
            {...register("phone_number")}
            className={`${errors.name && "shadow-red-500" } w-1/4 rounded border border-[#9888FF] focus:outline-none p-5 bg-[#ECECFF] text-xl`}
            placeholder="Contact Number" 
          />
          <input
            {...register("password")}
            className={`${errors.name && "shadow-red-500" } w-1/4 rounded border border-[#9888FF] focus:outline-none p-5 bg-[#ECECFF] text-xl`}
            placeholder="Password"
            type="password" 
          />
          <input
            {...register("confirm_password")}
            className={`${errors.name && "shadow-red-500" } w-1/4 rounded border border-[#9888FF] focus:outline-none p-5 bg-[#ECECFF] text-xl`}
            placeholder="Confirm Password"
            type="password" 
          />
          <button disabled={isSubmitting} type="submit" className="w-2/12 p-5 rounded border border-[#9888FF] bg-[#AC9EFF] hover:bg-[#9888FF] text-xl">
            Sign Up
          </button>
          <p className="relative top-5 text-sm"> Already a regestired Institution ? <Link href="/login" className="text-[#AC9EFF] cursor-pointer">Login</Link></p>
        </form>
    </main>
  );
}

