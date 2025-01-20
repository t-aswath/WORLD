import { AreaChart } from "@/components/charts/areachart";
import { Button } from "@/components/ui/button";
import { backend } from "@/utils/config";
import { notFound } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PublicationSchema } from "@/utils/validator";
import { z } from "zod";
import Link from "next/link";

type TPublication = z.infer<typeof PublicationSchema>;
interface TStaffData {
  staff: {
    name: string;
    department: string;
    institution: string;
    linkedin: string;
    research_gate: string;
  };
  h_index: string;
  i_index: string;
  chart: {
    area: { year: string; category: string; value: number }[],
    publications:  { year: number; SCI: number; SCOPUS: number; ESCI: number }[],
    indexdata: { year: number; citations: number }[],
  },
  publication_count: { type: string; count: string }[];
  publications: TPublication[];
}

  function createIndexFrequency(publications: TPublication[]): [string, number][] {
    const indexFrequency: Record<string, number> = {};

    // Count the frequency of each index
    for (const publication of publications) {
        const { index } = publication;
        if (indexFrequency[index]) {
            indexFrequency[index]++;
        } else {
            indexFrequency[index] = 1;
        }
    }

    // Convert object to array of [index, count] pairs
    const frequencyArray: [string, number][] = Object.entries(indexFrequency).map(([key, value]) => [key, value as number]);

    // Sort the frequency array by count in descending order
    frequencyArray.sort((a, b) => b[1] - a[1]);

    // Get the top 3 entries and the rest grouped as "Other"
    const top3 = frequencyArray.slice(0, 3);
    const others = frequencyArray.slice(3);

    // Sum the counts of the "Other" entries
    const othersSum = others.reduce((sum, entry) => sum + entry[1], 0);

    // Create the final array: top 3 + "Other"
    const finalResult: [string, number][] = [
        ...top3,
        ["Other", othersSum] // "Other" entry with summed frequency
    ];

    return finalResult;
  }

  const areadata = [
    { year: "2018", category: "Journals", value: 5 },
    { year: "2018", category: "Conference", value: 9 },
    { year: "2018", category: "Books", value: 3 },
    { year: "2018", category: "Patents", value: 0 },
    { year: "2019", category: "Journals", value: 10 },
    { year: "2019", category: "Conference", value: 2 },
    { year: "2019", category: "Books", value: 1 },
    { year: "2019", category: "Patents", value: 2 },
    { year: "2020", category: "Journals", value: 5 },
    { year: "2020", category: "Conference", value: 15 },
    { year: "2020", category: "Books", value: 20 },
    { year: "2020", category: "Patents", value: 1 },
    { year: "2021", category: "Journals", value: 20 },
    { year: "2021", category: "Conference", value: 10 },
    { year: "2021", category: "Books", value: 5 },
    { year: "2021", category: "Patents", value: 5 },
    { year: "2022", category: "Journals", value: 40 },
    { year: "2022", category: "Conference", value: 30 },
    { year: "2022", category: "Books", value: 20 },
    { year: "2022", category: "Patents", value: 10 },
    { year: "2023", category: "Journals", value: 50 },
    { year: "2023", category: "Conference", value: 40 },
    { year: "2023", category: "Books", value: 25 },
    { year: "2023", category: "Patents", value: 15 },
    { year: "2024", category: "Journals", value: 6 },
    { year: "2024", category: "Conference", value: 4 },
    { year: "2024", category: "Books", value: 3 },
    { year: "2024", category: "Patents", value: 2 },
  ];

async function get_staff_id(id: string) {
  try {
    let res = await fetch(`${backend}/api/v1/staff/get-staff-id/${id}`, {
      cache: "force-cache",
    });

    let data = await res.json();
    if (!data) notFound();
    return data;
  } catch (e) {
    notFound();
  }
}

export default async function InstitutionPublicProfile({
  params,
}: {
  params: Promise<{ staff_id: string }>;
}) {
  const { staff_id } = await params;
  const response : TStaffData = (await get_staff_id(staff_id));
const data = response.filtered_data;


  let publications_this_year = 0;
  for (let x of data.publications) if (x.year === "2024") publications_this_year++;
  const indexInfo = createIndexFrequency(data.publications);

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <section className="bg-white rounded-md shadow-md flex pt-24 p-8 pb-5 space-x-5 items-center ">
        <div className="bg-black min-w-20 w-20 h-20 rounded-full" />
        <div className="flex flex-col w-full">
          <h1 className="text-3xl font-bold">{data.staff.name}</h1>
          <p className="text-sm">{data.staff.department}</p>
        </div>
        <Button className="self-end">Export</Button>
      </section>
      <article className="w-full p-5">
        <section className="w-full flex space-x-4">
          <div className="w-full bg-white shadow-md rounded-md p-3">
            <h1 className="text-2xl font-bold">Institution Description</h1>
            <p>
              {
                "RReprehenderit adipisicing nulla laboris eu incididunt ad voluptate quis aliqua laborum eu ipsum nostrud labore. Nulla do Lorem id esse proident. Sunt adipisicing eu aliquip. Lorem in et voluptate id nisi deserunt.eprehenderit adipisicing nulla laboris eu incididunt ad voluptate quis aliqua laborum eu ipsum nostrud labore. Nulla do Lorem id esse proident. Sunt adipisicing eu aliquip. Lorem in et voluptate id nisi deserunt."
              }
            </p>
            <h1 className="text-2xl font-bold pt-4">Contact</h1>
            <table className="w-full max-w-md">
              <tbody>
                <tr>
                  <td className="font-bold">Linkedin</td>
                  <td> <Link href={data.staff.linkedin} >{data.staff.linkedin}</Link></td>
                </tr>
                <tr>
                  <td className="font-bold">Research Gate</td>
                  <td> <Link href={data.staff.research_gate} >{data.staff.research_gate}</Link></td>
                </tr>
                <tr>
                  <td className="font-bold">Phone Number</td>
                  <td>None</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid w-full max-w-md grid-rows-2	grid-cols-2 gap-3">
            <div className="w-full max-w-md bg-white shadow-md rounded-md flex flex-col items-center justify-center">
              <h1 className="text-6xl font-bold">{data.h_index}</h1>
              <p className="text-2xl">h-Index</p>
            </div>
            <div className="w-full max-w-md bg-white shadow-md rounded-md flex flex-col items-center justify-center">
              <h1 className="text-6xl font-bold">{data.i_index}</h1>
              <p className="text-2xl">i10-Index</p>
            </div>
            <div className="w-full max-w-md bg-white shadow-md rounded-md flex flex-col items-center justify-center">
              <h1 className="text-6xl font-bold">{data.publications.length}</h1>
              <p className="text-2xl">Total Publication</p>
            </div>
            <div className="w-full max-w-md bg-white shadow-md rounded-md flex flex-col items-center justify-center">
              <h1 className="text-6xl font-bold">{publications_this_year}</h1>
              <p className="text-xl">Publication This Year</p>
            </div>
          </div>
        </section>

        <section className="w-full flex flex-col  pt-5 max-w-xl">
            <h1 className="text-xl font-bold pb-2">Most Indexed Publications</h1>
            <div className="flex space-x-4">
        {indexInfo.map((val, i) => 
            <div key={i} className="w-full max-w-md bg-white shadow-md rounded-md flex flex-col items-center justify-center py-5">
              <h1 className="text-6xl font-bold">{val[1]}</h1>
              <p className="text-xl">{val[0]}</p>
            </div>
        )}
        </div>
        </section>

        <section className="w-full flex">
          <AreaChart data={areadata} height={300} width={500}/>
          {/*
          <PublicationGraph data={data.chart.publications} height={300} width={500}/>
          <LinePlot data={data.chart.indexdata} height={300} width={500}/>
          */}
        </section>

        <h1 className="text-5xl font-bold pt-10">PUBLICATION DETAILS</h1>
        <DataTable columns={columns} data={data.publications}/>

        <section className="h-24 w-full"></section>
      </article>
    </main>
  );
}
