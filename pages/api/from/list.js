import pool from "../../../sql_conn/activity";

export default async function GetListAPI(req, res) {
  try {
    let sql = `
        SELECT 
            form.id, form.name, form.banner, form.content, form.deadline, form.enable, auto_open, auto_close, 
            form.create_at, form.create_by, form.update_at, form.update_by, 
            form_department.name department, form_category.name category
        FROM form 
        LEFT JOIN form_department ON form.department_id = form_department.id
        LEFT JOIN form_category ON form.category_id = form_category.id
        ORDER BY form.create_at DESC
    `;
    let result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
  }
}
