import { z } from "zod";
import { Request, Response } from 'express'
import { pool } from "../../utils/config.js";
import { InstitutionSchema } from "../../utils/validators.js";

type InstitutionType = z.infer<typeof InstitutionSchema>
export default async function get_admin(req: Request, res: Response) {
  const IdValidator = z.object({id: z.string().uuid()});
  const { id } = IdValidator.parse(req.body.user);

  const data: InstitutionType = (await pool.query("SELECT * FROM institutions WHERE ins_id=$1;", [ id ])).rows[0];
  if (!data) return res.status(404).json({msg: "The user is not found", sucess: false});

  const filtered_data = { 
    id: data.ins_id, 
    name: data.name, 
    address: data.address, 
    founded_year: data.founded_year,
    url: data.logo_url,
    phone_number: data.phone_number,
    website: data.website,
    mail: data.mail
  };

  res.status(200).json({ data: filtered_data, msg: "Retrived your profile sucessfully !!!", sucess: true });
}

