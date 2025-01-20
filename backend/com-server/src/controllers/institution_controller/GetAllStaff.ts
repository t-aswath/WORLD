import { z } from "zod";
import { Request, Response } from 'express'
import { pool } from "../../utils/config.js";
import { StaffSchema } from "../../utils/validators.js";


const InstitutionId = z.string();
type StaffType = z.infer<typeof StaffSchema>

export default async function get_all_staffs(req: Request, res: Response) {
  const institution_id = InstitutionId.parse(req.params.institution_id);
  const result = await pool.query("SELECT * FROM staffs WHERE institution=$1;", [institution_id]);
  const data: StaffType[] = result.rows;

  res.status(200).json({ msg: "got all the staffs belong to the given institution,", sucess: true, data });
}

