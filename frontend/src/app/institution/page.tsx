import InstitutionSearchInput from "@/components/InstitutionSearchInput";
import SearchInstitution from "@/components/SearchInstitution";
import { backend } from "@/utils/config";
import { InstitutionSchema } from "@/utils/validator";
import { notFound } from "next/navigation";
import { z } from "zod";


type TInstitutionList = z.infer<typeof InstitutionSchema>

async function get_all_institution() {
  try {
    let res = await fetch(`${backend}/api/v1/institution/get-all`, {
      cache: "force-cache",
    });

    let data = await res.json();
    if (!data) notFound();
    return data;
  } catch (e) {
    notFound();
  }
}

export default async function InstitutionListPage() {
  const data: TInstitutionList[] = (await get_all_institution()).data;

  return (
    <main className="w-full h-screen p-8">
      <section className="flex max-w-sm pt-16 space-x-2">
        <InstitutionSearchInput />
      </section>
      <SearchInstitution data={data}/>
    </main>
  );
}
