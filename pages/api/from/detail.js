import pool from "../../../sql_conn/activity";

export default async function DetailAPI(req, res) {
  const id = req.query.id;
  try {
    let sql = `
        WITH detail_content AS (
          SELECT 
            detail_id, 
            COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'enable', detail_content.enable,
                'other_input', detail_content.other_input,
                'content_id', COALESCE(detail_content.id, null),
                'content', COALESCE(detail_content.content, null)
              ) ORDER BY detail_content.index
            ),
            '[]'::json
            ) AS content
          FROM detail_content 
          GROUP BY detail_id
        )

        SELECT 
          id, form_id, index, type, required, title, enable, 
          COALESCE(detail_content.content, '[]'::json) AS content
        FROM form_detail
        LEFT JOIN detail_content ON detail_content.detail_id = form_detail.id
        WHERE form_detail.form_id = $1
        ORDER BY form_detail.index
    `;
    let detail = await pool.query(sql, [id]);

    sql = `
        SELECT 
          id, name, banner, content, deadline, enable, auto_open, auto_close, 
          department_id, category_id, finish_photo, finish_message 
        FROM form
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
