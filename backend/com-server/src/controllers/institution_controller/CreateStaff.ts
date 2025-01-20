import { z } from "zod";
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { pool } from "../../utils/config.js";
import { StaffSchema } from "../../utils/validators.js";

const StaffCreation = StaffSchema.pick({name: true, department: true, email: true, phone_number: true }).extend({password: z.string()});

export default async function create_staff(req: Request, res: Response) {
  const {name, department, email, phone_number, password } = StaffCreation.parse(req.body);
  const IdValidator = z.object({id: z.string().uuid()});
  const { id } = IdValidator.parse(req.body.user);

  const hashed_password = await bcrypt.hash(password, 10);

  const params = [name, email, phone_number, department, id, hashed_password];
  await pool.query(`INSERT INTO staffs (name, email, phone_number, department, institution, hashed_password) VALUES ($1, $2, $3, $4, $5, $6);`, params);

  res.status(200).json({ msg: "staff created ", sucess: true });
}

