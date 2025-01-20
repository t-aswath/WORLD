import { Response, Request } from 'express'
import { z } from "zod";
import { pool } from "../../utils/config.js";


export default async function update_staff(req: Request, res: Response) {
    const UpdateValidator = z.object({
        staff_id: z.string().uuid(),
        attribute: z.string().array(),
        value: z.string().array(),
    });
    const {staff_id, attribute , value} = UpdateValidator.parse(req.body);

    const allowedAttributes = [
        'staff_id', 
        'name', 
        'description', 
        'designation', 
        'email', 
        'phone_number', 
        'department', 
        'profile_picture_url', 
        'hashed_password', 
        'total_citation', 
        'h_index', 
        'i_index', 
        'google_scholer_id', 
        'research_gate', 
        'portfolio', 
        'linked_in', 
        'layout', 
        'institution'
    ];

    for (const attr of attribute) {
        if (!allowedAttributes.includes(attr)) {
            res.status(400).json({ msg: "attribute not found", sucess: false });
            return;
        }
    }

    if (attribute.length !== value.length) {
        res.status(400).json({ msg: "attribute and value length not same", sucess: false });
        return;
    }

    for (let i = 0; i < attribute.length; i++) {
        const params = [value[i], staff_id];
        await pool.query(`UPDATE staffs SET ${attribute[i]} = $1 WHERE staff_id = $2;`, params);
    }

    res.status(200).json({ msg: "update sucessfull", sucess: true });
}
