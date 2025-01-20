import { Response, Request } from 'express'
import { z } from "zod";
import { pool } from "../../utils/config.js";

export default async function create_publication(req: Request, res: Response) {
  const PublicationValidator = z.object({
    Title: z.string().optional(),
    Year: z.number().optional(),
    Journal: z.string().optional(),
    Volume: z.number().optional(),
    Issue: z.string().optional(),
    Pages: z.string().optional(),
    Publisher: z.string().optional(),
    Description: z.string().optional(),
    Citation: z.number().optional(),
    URL: z.string().optional(),
    Catagory: z.string().optional(),
    Index: z.string().optional(),
    Issn: z.string().optional(),
    staff_id: z.string().uuid().optional(),
  });

  const {staff_id, Title,Year, Journal,Publisher, Description, Citation, URL, Catagory, Index, Issn } = PublicationValidator.parse(req.body);
  const params = [staff_id, Title,Year, Journal,Publisher, Description, Citation, URL, Catagory, Index, Issn];


  await pool.query(
        "INSERT INTO publications (staff_id, title, year, journal, publisher, discription, citation, url, type, index, issn) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);",
        params
  )
  
  res.status(200).json({ msg: "got all data", sucess: true });
};
