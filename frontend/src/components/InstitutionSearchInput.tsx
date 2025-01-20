'use client'

import { useInstitutionSearchStore } from "@/utils/store";
import { Input } from "./ui/input";

export default function InstitutionSearchInput() {
  const {setSearchName} = useInstitutionSearchStore(state => state);
  return <Input placeholder="Search Institution" onChange={(e) => setSearchName(e.target.value)} />
}
