import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Input } from "./ui/input"

interface TPublicationData {
    publication_id: string;
    title: string;
    type: string;
    publisher: string;
    description: string;
    citation: string;
    index: string;
    year: string;
    url: string;
    is_archived: string;
    staff_id: string;
    pinnded: string;
  };

interface prop {
  publication_data: TPublicationData[],
};

export default function PublicationTable({publication_data}: prop) {

  return <section className="pt-3 flex space-x-5">
        <section className="shadow-md w-full bg-white rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="">Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Publisher</TableHead>
                <TableHead>Total Citations</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Index</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {publication_data.map((val, i) => 
              <TableRow key={i}>
                <TableCell>{val.title}</TableCell>
                <TableCell>{val.type}</TableCell>
                <TableCell>{val.publisher}</TableCell>
                <TableCell>{val.citation}</TableCell>
                <TableCell>{val.year}</TableCell>
                <TableCell>{val.index}</TableCell>
              </TableRow>
            )}
            </TableBody>
          </Table>
        </section>

        <section className="w-full max-w-sm bg-white p-3 rounded-md">
          <Input placeholder="search"/>
          <Input type="range"/>
        </section>

      </section>
};
