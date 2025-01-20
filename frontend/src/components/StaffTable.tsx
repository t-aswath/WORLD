import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Input } from "./ui/input"
import { z } from "zod"
import { StaffSchema } from "@/utils/validator";
import Link from "next/link";

type TStaffType = z.infer<typeof StaffSchema>;
interface prop {
  staff_data: TStaffType[],
};

export default function StaffTable({staff_data}: prop) {

  return <section className="pt-3 flex space-x-5">
        <section className="shadow-md w-full bg-white rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="">Name</TableHead>
                <TableHead>Dept.</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Total Citations</TableHead>
                <TableHead>H_Index</TableHead>
                <TableHead>I_Index</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {staff_data.map((val, i) => 
              <TableRow key={i}>
                <TableCell className="font-medium"><a href={`/staff/${val.staff_id}`}>{val.name}</a></TableCell>
                <TableCell>{val.department}</TableCell>
                <TableCell>{val.designation}</TableCell>
                <TableCell>{val.total_citation}</TableCell>
                <TableCell>{val.h_index}</TableCell>
                <TableCell>{val.i_index}</TableCell>
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
