"use client";

import axios from "@/utils/axios";
import { useAuthContext } from "@/utils/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { z } from "zod";

import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

type TLoginType = "institution" | "staff";

const LoginValidator = z.object({
    username: z.string().min(1).max(30).email(),
    password: z.string().min(3).max(30),
});

export default function Login() {
  const [loginType, setLoginType] = useState<TLoginType>("institution");
  const router = useRouter()
  const setAuth = useAuthContext(s => s.setAuth);

  type TLogin = z.infer<typeof LoginValidator>;
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<TLogin>({
    resolver: zodResolver(LoginValidator)
  });
  const onSubmit = async (data: TLogin) => {
    try {
      const response = await axios.post(`/api/v1/auth/${loginType}/login`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      setAuth({
        id: "",
        name: response.data.name || "",
        email: response.data.email || "",
        type: (loginType === 'staff') ? "STF" : "INS",
      });

      toast.success("Logged In Sucessfully");
      if (response.statusText === "OK") return router.push(`${loginType}/admin`);

    } catch (e: any) {
      if (e.status === 401) {
        toast.error("Password might be wrong")
      } else if (e.status === 400) {
        toast.error("Email may not exist");
      };

      setError("root", {
        type: "server",
        message: "Somthing With The Server",
      });
    }
  };

  useEffect(() => {
    if (errors.username) {
      toast.error(errors.username.message);
    } else if (errors.password) {
      toast.error(errors.password.message);
    } else if (errors.root) {
      toast.error(errors.root.message);
    }
  }, [errors]);

  return (
    <main className="flex items-center justify-center min-h-screen">

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full  space-y-3">
        <h1 className="text-5xl font-bold">Welcome to THE WORLD</h1>
        <p className="text-xl">
          Login as:{" "}
          <span className={`cursor-pointer hover:italic ${loginType === "institution" && "underline text-[#AC9EFF]"}`} onClick={() => setLoginType("institution")}>
            Institution
          </span>{" | "}
          <span className={`cursor-pointer hover:italic ${loginType === "staff" && "underline text-[#AC9EFF]"}`} onClick={() => setLoginType("staff")}>
            Staff
          </span>
        </p>
        <input 
          {...register("username")}
          className="w-1/4 rounded border border-[#9888FF] focus:outline-none p-5 bg-[#ECECFF] text-xl"
          placeholder="Mail ID" 
        />
        <input
          {...register("password")}
          className="w-1/4 rounded border border-[#9888FF] focus:outline-none p-5 bg-[#ECECFF] text-xl"
          placeholder="Password"
          type="password" 
        />
        <button disabled={isSubmitting} onSubmit={handleSubmit(onSubmit)} className="w-2/12 p-5 py-1 rounded border border-[#9888FF] bg-[#AC9EFF] hover:bg-[#9888FF] text-xl">
          Login
        </button>
        {loginType === 'institution' && <h1 className="text-sm">forgot password? 
          <Link href="reset-password" className="text-[#9888FF]"> Reset it </Link></h1>}
        <p className="relative top-5 text-sm">New Institution ? <Link href="signup" className="text-[#AC9EFF] cursor-pointer">Sign-Up</Link> with us</p>`
      </form>
      <ToastContainer />
    </main>
  );
}

