import pool from "../../../sql_conn/activity";

export default async function GetListAPI(req, res) {
  try {
    let sql = `
        SELECT 
            id, name, banner, content, deadline, enable, auto_open, auto_close, create_at, create_by, update_at, update_by, 
            CASE department 
                WHEN '1' THEN '餐廳' 
                WHEN '2' THEN '健身房' 
            END department
        FROM form 
    `;
    let result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
  }
}
