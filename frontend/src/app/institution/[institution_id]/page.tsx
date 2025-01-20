import StaffTable from "@/components/StaffTable";
import { Button } from "@/components/ui/button";
import { backend } from "@/utils/config";
import { InstitutionSchema, StaffSchema } from "@/utils/validator";
import { notFound } from "next/navigation";
import { z } from "zod";
import { DataTable } from "./data-table";
import { columns } from "./columns";

async function get_institution_id(id: string) {
  try {
    let res = await fetch(`${backend}/api/v1/institution/get-institution/${id}`, {
      cache: "force-cache",
    });

    let data = await res.json();
    if (!data) notFound();

    return data;
  } catch (e) {
    notFound();
  }
}

async function get_staff_from_institution(id: string) {
  try {
    let res = await fetch(`${backend}/api/v1/institution/get-all-staffs/${id}`, {
      cache: "force-cache",
    });

    let data = await res.json();
    if (!data) notFound();
    return data;
  } catch (e) {
    notFound();
  }
}

type TInstitutionType = z.infer<typeof InstitutionSchema>
type TStaffType = z.infer<typeof StaffSchema>

export default async function InstitutionPublicProfile({ params, }: { params: Promise<{ institution_id: string }>; }) {
  const { institution_id } = await params;
  const data: TInstitutionType = (await get_institution_id(institution_id)).data;
  const staff_data: TStaffType[] = (await get_staff_from_institution(institution_id)).data;
  console.log(data)

  return <main className="w-full min-h-screen bg-gray-50">
    <section className="bg-white rounded-md shadow-md flex pt-24 p-8 pb-5 space-x-5 items-center ">
      <div className="bg-black min-w-20 w-20 h-20 rounded-full"/>
      <div className="flex flex-col w-full">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p className="text-sm">{data.address}</p>
      </div>
      <Button className="self-end">Export</Button>
    </section>
    <article className="w-full p-5">
      <section className="w-full flex space-x-4">
        <div className="grid w-full max-w-md grid-rows-2	grid-cols-2 gap-3">
          <div className="w-full max-w-md bg-white shadow-md rounded-md flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold">{data.index_count && data.index_count.length !== 0 && data.index_count[0].count}</h1>
            <p className="text-2xl">{data.index_count && data.index_count.length !== 0 && data.index_count[0].index}</p>
          </div>
          <div className="w-full max-w-md bg-white shadow-md rounded-md flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold">{data.index_count && data.index_count.length !== 0 && data.index_count[1].count}</h1>
            <p className="text-2xl">{data.index_count && data.index_count.length !== 0 && data.index_count[1].index}</p>
          </div>
          <div className="w-full max-w-md bg-white shadow-md rounded-md flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold">0</h1>
            <p className="text-2xl">SCI</p>
          </div>
          <div className="w-full max-w-md bg-white shadow-md rounded-md flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold">0</h1>
            <p className="text-2xl">Other</p>
          </div>
        </div>
        <div className="w-full bg-white shadow-md rounded-md p-3">
          <h1 className="text-2xl font-bold">Institution Description</h1>
          <p>{data.description || "RReprehenderit adipisicing nulla laboris eu incididunt ad voluptate quis aliqua laborum eu ipsum nostrud labore. Nulla do Lorem id esse proident. Sunt adipisicing eu aliquip. Lorem in et voluptate id nisi deserunt.eprehenderit adipisicing nulla laboris eu incididunt ad voluptate quis aliqua laborum eu ipsum nostrud labore. Nulla do Lorem id esse proident. Sunt adipisicing eu aliquip. Lorem in et voluptate id nisi deserunt."}</p>
          <h1 className="text-2xl font-bold pt-4">Contact</h1>
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

        </div>
      </section>

      <section className="w-full flex space-x-4 pt-5">
        <div className="w-full min-w-[550px] max-w-[550px] bg-white shadow-md rounded-md p-3">
          <h1 className="text-2xl font-bold">Feild Summary</h1>
          <p>{data.description || "RReprehenderit adipisicing nulla d esse proident. Sunt adipisicing eu aliquip. Lorem in et voluptate id nisi deserunt.eprehenderit adipisicing nulla laboris eu incididunt ad voluptate quis aliqua laborum eu ipsum nostrud labore. Nulla do Lorem id esse proident. Sunt adipisicing eu aliquip. Lorem in et voluptate id nisi deserunt."}</p>
        </div>
        <div className="w-full bg-white shadow-md rounded-md flex items-center justify-center flex-col">
            <h1 className="text-6xl font-bold">{data.total_publications}</h1>
            <p className="text-2xl">Total Publication</p>
        </div>
        <div className="w-full bg-white shadow-md rounded-md flex items-center justify-center flex-col">
            <h1 className="text-6xl font-bold">{data.total_staffs}</h1>
            <p className="text-2xl">Total Staff</p>
        </div>
        <div className="w-full max-w-[200px] flex flex-col space-y-2">
          <div className="w-full bg-white shadow-md rounded-md flex items-center justify-center flex-col flex-1 h-0">
            <h1 className="text-xl font-bold inline-flex items-center">{data.type_count && data.type_count.length !== 0 && data.type_count[0].count}&nbsp;<span>{data.type_count && data.type_count.length !== 0 && data.type_count[0].type}</span></h1>
          </div>
          <div className="w-full bg-white shadow-md rounded-md flex items-center justify-center flex-col flex-1 h-0">
            <h1 className="text-xl font-bold inline-flex items-center">{data.type_count && data.type_count.length !== 0 && data.type_count[1].count}&nbsp;<span>{data.type_count && data.type_count.length !== 0 && data.type_count[1].type}</span></h1>
          </div>
        </div>
      </section>

      <h1 className="text-5xl font-bold py-10">STAFF DETAILS</h1>
      {/*<StaffTable staff_data={staff_data} />*/}
      <DataTable columns={columns} data={staff_data} />


      <section className="h-24 w-full"></section>
    </article>
  </main>
};
