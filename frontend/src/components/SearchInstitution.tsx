'use client'

import { useInstitutionSearchStore } from "@/utils/store";
import { InstitutionSchema } from "@/utils/validator";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";

type TInstitutionList = z.infer<typeof InstitutionSchema>
interface props {
  data: TInstitutionList[];
}

export default function SearchInstitution({data}: props) {
  const [ displayData, setDisplayData ] = useState<TInstitutionList[]>(data)
  const {searchName} = useInstitutionSearchStore(state => state);

  useEffect(() => {
    if (searchName === '') return setDisplayData(data);
    const regex = new RegExp(`${searchName}`, "ig");
    let temp = data.filter(v => (v.name.match(regex)))

    setDisplayData(temp);
  }, [searchName]);

  return (<section className="flex flex-col space-y-2 pt-10">
    { displayData.map((val, i) => 
      <section key={i} className="flex w-full border justify-between h-20 rounded-md">
        <section className="py5 px-2 rounded-md flex items-center space-x-3 shadow-sm">
          <div className="w-16 h-16 bg-black rounded-full"></div>
          <div className="flex flex-col">
            <Link href={`institution/${val.ins_id}`} className="font-bold">{val.name}</Link>
            <h1 className="font-light text-sm"> {val.address} </h1>
          </div>
        </section>
        <Link href={`institution/${val.ins_id}`} className="bg-black text-white w-24 border-black cursor-pointer flex items-center justify-center hover:bg-white hover:text-black hover:border">
          <IconArrowRight className="" size={30} />
        </Link>
      </section>
    )}
  </section>)
};
