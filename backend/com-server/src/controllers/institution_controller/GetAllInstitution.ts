import { z } from "zod";
import { Request, Response } from 'express'
import { pool } from "../../utils/config.js";
import { InstitutionSchema } from "../../utils/validators";

type InstitutionType = z.infer<typeof InstitutionSchema>
export default async function get_all_institutions(_: Request, res: Response) {
  const result = await pool.query("SELECT * FROM institutions;");
  const all_institutions: InstitutionType[]  = result.rows;
  res.status(200).json({ msg: "got all data", sucess: true, data: all_institutions });
}


