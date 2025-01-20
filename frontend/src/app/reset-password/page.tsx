"use client";

import OtpInput from 'react-otp-input';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import axios from '@/utils/axios';

const ResetValidator = z.object({
  email: z.string().min(0).email(),
});

export default function ResetPassword() {
  const OTP = useRef<number>(0);

  const [phase, setPhase] = useState<"email" | "otp" | "new">("email");
  const [otp, setOtp] = useState('');

  type TReset = z.infer<typeof ResetValidator>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TReset>({ resolver: zodResolver(ResetValidator) });
  const onSubmitEmail = async (data: TReset) => {
    try {
      const TempOtp = Math.floor(100000 + Math.random() * 900000);
      OTP.current = TempOtp;
      const response = await axios.post(
        `/api/v1/auth/reset-password`,
        { email: data.email, otp: TempOtp },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (response.statusText === "ok") setPhase("otp");
    } catch (e: any) {
      if (e.status === 404) toast.error("Email Does not exist");
      else toast.error("Server Error");
    }
  };

  const onSubmitOTP = async (e: any) => {
    e.preventDefault();
    setPhase("new");
  };

  useEffect(() => {
    if (errors.email) {
      toast.error(errors.email.message);
    }
  }, [errors]);

  return (
    <main className="w-full min-h-screen bg-blue-100 flex items-center justify-center">
      {phase === "email" && (
        <form
          onSubmit={handleSubmit(onSubmitEmail)}
          className="w-full max-w-sm space-y-2"
        >
          <input
            {...register("email")}
            className="w-full rounded border border-[#9888FF] focus:outline-none p-5 bg-[#ECECFF] text-xl"
            placeholder="Enter Your Email"
          />
          <button
            disabled={isSubmitting}
            className="w-full p-5 py-1 rounded border border-[#9888FF] bg-[#AC9EFF] hover:bg-[#9888FF] text-xl"
          >
            Reset
          </button>
        </form>
      )}
      {phase === "otp" && (
        <form onSubmit={onSubmitOTP} className="w-full max-w-sm space-y-2">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
          />
          <button
            type="submit"
            className="w-full p-5 py-1 rounded border border-[#9888FF] bg-[#AC9EFF] hover:bg-[#9888FF] text-xl"
          >
            Submit
          </button>
        </form>
      )}
      { phase === "new" && (
        <form className="w-full max-w-sm space-y-2">
          <input
            className="w-full rounded border border-[#9888FF] focus:outline-none p-5 bg-[#ECECFF] text-xl"
            placeholder="new password"
          />
          <input
            className="w-full rounded border border-[#9888FF] focus:outline-none p-5 bg-[#ECECFF] text-xl"
            placeholder="confirm password"
          />
          <button
            type="submit"
            className="w-full p-5 py-1 rounded border border-[#9888FF] bg-[#AC9EFF] hover:bg-[#9888FF] text-xl"
          >
            Submit
          </button>
        </form>
      )}
      <ToastContainer />
    </main>
  );
}
