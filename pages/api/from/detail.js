import pool from "../../../sql_conn/activity";

export default async function DetailAPI(req, res) {
  const id = req.query.id;
  try {
    let sql = `
        WITH detail_content AS (
            SELECT detail_id, ARRAY_AGG(content) content FROM detail_content 
            GROUP BY detail_id
        )

        SELECT 
          id, form_id, index, type, required, title, enable, COALESCE(content, ARRAY[]::text[]) AS content
        FROM form_detail
        LEFT JOIN detail_content ON detail_id = form_detail.id
        WHERE form_detail.form_id = $1
        ORDER BY form_detail.index
    `;
    let detail = await pool.query(sql, [id]);

    sql = `
        SELECT id, name, banner, content, deadline, enable, auto_open, auto_close, department FROM form
        WHERE id = $1
    `;
    let form = await pool.query(sql, [id]);
    res.status(200).json({
      form: form.rows[0],
      detail: detail.rows
    });
  } catch (error) {
    console.error(error);
  }
}
