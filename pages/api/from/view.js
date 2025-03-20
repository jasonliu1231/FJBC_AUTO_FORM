import pool from "../../../sql_conn/activity";

export default async function DetailAPI(req, res) {
  const id = req.query.id;
  try {
    let sql = `SELECT * FROM form WHERE id = $1 AND enable=true`;
    let result = await pool.query(sql, [id]);
    if (result.rows.length == 0) {
      res.status(400).json({ msg: "活動表單已關閉" });
    }
    sql = `
        WITH detail_content AS (
          SELECT id, detail_id, content, enable, other_input FROM detail_content
        )

        SELECT 
          form_detail.id, form_id, index, type, required, title, form_detail.enable, 
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', detail_content.id,
              'enable', detail_content.enable,
              'other_input', detail_content.other_input,
              'detail_id', detail_content.id,
              'content', detail_content.content
            )
          )
          content 
        FROM form_detail
        LEFT JOIN detail_content ON detail_content.detail_id = form_detail.id
        WHERE form_detail.form_id = $1
        GROUP BY form_detail.id, form_id, index, type, required, title, form_detail.enable
        ORDER BY form_detail.index
    `;
    let detail = await pool.query(sql, [id]);

    sql = `
        SELECT id, name, banner, content, deadline, enable, finish_photo, finish_message FROM form
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
