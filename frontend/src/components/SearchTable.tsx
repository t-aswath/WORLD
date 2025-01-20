"use client";

import { PublicationSchema } from "@/utils/validator";
import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";

type PublicationType = z.infer<typeof PublicationSchema>
interface props {
  data: PublicationType[];
};

export default function SearchTable({data}: props) {
  const [ displayData, setDisplayData ] = useState<PublicationType[]>(data)
  const [ search_name, setSearchName ] = useState<string>("");

  useEffect(() => {
    if (search_name === '') return setDisplayData(data);
    const regex = new RegExp(`${search_name}`, "ig");
    let temp = data.filter(v => (v.title.match(regex)))

    setDisplayData(temp);
  }, [search_name]);

  return (
    <section className="w-full h-96 flex mt5">
      <section className="bg-pink100 h-full w-full space-x3">
        <table className="w-full max-w-5xl border-collapse font-mono mt-4">
          <thead>
            <tr className="bg-purple-100">
              <td className="border p-2 w-48">Title</td>
              <td className="border p-2">Citations</td>
              <td className="border p-2">Year</td>

            </tr>
          </thead>
          <tbody>
          {displayData.map((val,i) => 
            <tr key={i}>
              <td className="border p-2 w-full"><Link href={val.url}>{val.title}</Link></td>
              <td className="border p-2 w-2">{val.citation}</td>
              <td className="border p-2 w-2">{val.year}</td>
            </tr>
          )}
          </tbody>
        </table>
      </section>
      <section className="bglime-200 h-full w-full max-w-sm p-3">
        <input
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full max-w-xl rounded border border-[#9888FF] focus:outline-none p-5 bg-[#ECECFF] text-xl"
          placeholder="search staffs"
        />
      </section>
    </section>
  );
}
