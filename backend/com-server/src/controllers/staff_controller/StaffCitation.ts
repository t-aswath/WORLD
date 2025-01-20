import { Response, Request } from 'express'
import { z } from "zod";
import { pool } from "../../utils/config.js";


export default async function populate_staff_citation(req: Request, res: Response) {
    const UpdateValidator = z.object({
        staff_id: z.string().uuid(),
        year_citation: z.object({
            year: z.number(),
            citation: z.number(),
        }).array()
    });

    const {staff_id, year_citation} = UpdateValidator.parse(req.body);

    for (const year_cits  of year_citation.entries()) {
        const params = [staff_id,year_cits[1].year, year_cits[1].citation];
        await pool.query(`INSERT INTO staff_year_citation (staff_id, year, number_of_citation) VALUES ($1, $2, $3);`, params);
    }

    res.status(200).json({ msg: "citation population is sucessfull", sucess: true });
}
