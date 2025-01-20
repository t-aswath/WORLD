// export default function InstitutionAdmin() {
//   return (
//     <main className="w-full min-h-screen bg-yellow-50">
//       <form className="bg-yellow-200 flex flex-col w-full max-w-sm">
//         <input type="file" />
//         <button type="submit" className="bg-red-200">Submit</button>
//       </form>
//     </main>
//   );
// }
"use client";

import axios from "@/utils/axios";
// import useAxiosPrivate from "@/hooks/useAxios";
import { useAuthContext } from "@/utils/store";
import { StaffSchema } from "@/utils/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandFacebookFilled, IconBrandLinkedin, IconBrandX, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface TProfile {
  "id": string;
  "name": string;
  "address": string;
  "description": string | null;
  "founded_year": string;
  "url": string;
  "phone_number": string;
  "website": string;
  "mail": string;
};

interface TStaffFetched {
  staff_id: string;
  name: string;
  email: string;
};

export default function InstituteAdmin() {
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [staffs, setStaffs] = useState<TStaffFetched[] | null>(null);
  // const axiosPrivate = useAxiosPrivate();
  const axiosPrivate = axios;
  const { auth } = useAuthContext();

  type TStaff = z.infer<typeof StaffSchema>;
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<TStaff>({
    resolver: zodResolver(StaffSchema)
  });
  const onSubmit = async (data: TStaff) => {
    console.log(data);
    try {
      await axiosPrivate.post("/api/v1/institutions/create-staff", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
    } catch (e) {
      console.log(e);
      setError("root", {
        type: "server",
        message: "Somthing With The Server",
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const get_profiles = async () => {
      try {
        const response_profile = await axiosPrivate.get("/api/v1/institutions/admin", {
          signal: controller.signal,
        });

        const response_staffs = await axiosPrivate.get(`/api/v1/institutions/get-all-staffs/${response_profile.data.data.id}`, {
          signal: controller.signal,
        });

        isMounted && response_staffs.status !== 204 && setStaffs(response_staffs.data.UserData);
        isMounted && response_profile.status !== 204 && setProfile(response_profile.data.data);
      } catch (e: any) {
        if (e?.name === "CanceledError") console.log("Request Is Aborted");
        else console.log(e);
      }
    };


    get_profiles();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [auth]);

  console.log(staffs);

  return (
  <main className="min-h-screen w-full">
    <section className=" bg-red-200 h-56 w-full flex justify-between items-end px-20">
      <div className="elative bottom10 bg-black w-fit h-14 flex space-x-5 ">
        <Link href="x.com"><IconBrandX className="bg-white" size={40}/></Link>
        <Link href="x.com"><IconBrandFacebookFilled className="bg-white" size={40}/></Link>
        <Link href="x.com"><IconBrandLinkedin className="bg-white" size={40}/></Link>
      </div>
      <section className="relative right20 top-10 bg-emerald-100 h-40 w-40"/>
    </section>

    <section className="px-20">
      <h1 className="font-bold text-black text-5xl pt-5">{profile?.name}</h1>
      <h1 className="text-3xl pt-8">About</h1>
      <p className="text-md"> {profile?.description ?? "NNon deserunt ex enim eu proident aliquip id excepteur ea adipisicing ad ullamco. Incididunt cillum ex ex sint dolor quis. Esse magna minim culpa aliqua dolore qui aliquip. Commodo aute voluptate non minim proident eiusmod enim exercitation.on deserunt ex enim eu proident aliquip id excepteur ea adipisicing ad ullamco. Incididunt cillum ex ex sint dolor quis. Esse magna minim culpa aliqua dolore qui aliquip. Commodo aute voluptate non minim proident eiusmod enim exercitation."} </p>

      <h1 className="text-3xl pt-4">Contact</h1>
      
      <table className="w-full max-w-sm">
        <tbody>
        <tr>
          <td>Email</td>
          <td>citchennai.edu.in</td>
        </tr>
        <tr>
          <td>website</td>
          <td>www.google.com</td>
        </tr>
        <tr>
          <td>phone numer</td>
          <td>9876543210</td>
        </tr>
        <tr>
          <td>Address</td>
          <td>Chennai, Tamil Nadu</td>
        </tr>
        </tbody>
      </table>
    </section>

    <section className="px-20 py-8 bgzinc-50 h-[400px]">
      <section className="flex justify-between items-center">
        <h1 className="text-3xl">Staff Information</h1>
        <div className="space-x-2">
          <button className="bg-purple-100 py-1 p-5">Export</button>
          <label className="bg-purple-100 py-1 p-5 cursor-pointer"> <input className="hidden" type="file" /> Import</label>
          <button className="bg-purple-100 py-1 p-5">Add New</button>
        </div>
      </section>
      <table className="w-full max-w-5xl border-collapse font-mono mt-4">
        <thead>
          <tr className="bg-purple-100">
            <td className="border p-2">Id</td>
            <td className="border p-2">Name</td>
            <td className="border p-2">Email</td>
            <td className="border p-2 w-10">Operations</td>
          </tr>
        </thead>
        <tbody>
        {staffs?.map((val, i) => 
          <tr key={i}>
            <td className="border p-2">{val.staff_id.slice(1, 5)}</td>
            <td className="border p-2">{val.name}</td>
            <td className="border p-2">{val.email}</td>
            <td className="border p-2 text-right">{<IconX className="cursor-pointer hover:text-red-500" />}</td>
          </tr>)}
        </tbody>
      </table>
    </section>
    


  </main>)

  // return (
  //   <main>
  //     <h1>PROFILE</h1>
  //     <h1>{JSON.stringify(profile)}</h1>
  //     <br/>
  //     <h1>STAFFS</h1>
  //     <h1>{JSON.stringify(staffs)}</h1>

  //     <form onSubmit={handleSubmit(onSubmit)} className="border max-w-sm">
  //       <h1>STAFF DETAILS</h1>
  //       <input {...register("name")} className="shadow-[3px_3px_0px_0px_rgba(0,0,0)] h-8 text-xl rounded-md border border-[#0a0a0a] focus:outline-none p-5 w-full" 
  //         placeholder="name" />
  //       <input {...register("email")} className="shadow-[3px_3px_0px_0px_rgba(0,0,0)] h-8 text-xl rounded-md border border-[#0a0a0a] focus:outline-none p-5 w-full" 
  //         placeholder="email" />
  //       <input {...register("phone_number")} className="shadow-[3px_3px_0px_0px_rgba(0,0,0)] h-8 text-xl rounded-md border border-[#0a0a0a] focus:outline-none p-5 w-full" 
  //         placeholder="phone number" />
  //       <input {...register("department")} className="shadow-[3px_3px_0px_0px_rgba(0,0,0)] h-8 text-xl rounded-md border border-[#0a0a0a] focus:outline-none p-5 w-full" 
  //         placeholder="department" />
  //       <input {...register("password")} type="password" className="shadow-[3px_3px_0px_0px_rgba(0,0,0)] h-8 text-xl rounded-md border border-[#0a0a0a] focus:outline-none p-5 w-full" 
  //         placeholder="password" />

  //       <button disabled={isSubmitting} type="submit" className="shadow-[3px_3px_0px_0px_rgba(0,0,0)] p-5 py-2 bg-blue-400 hover:bg-blue-200 rounded-sm relative top-3">
  //         LOGIN
  //       </button>
  //     </form>
  //   </main>
  // );
}

