import pool from "../../../sql_conn/activity";

export default async function GetListAPI(req, res) {
  const id = req.query.id;
  try {
    let sql = `
    SELECT form_detail.index, type, title, ARRAY_AGG(content) content, ARRAY_AGG(COALESCE(count, 0)) count FROM form_detail
    LEFT JOIN detail_content ON form_detail.id = detail_content.detail_id
    LEFT JOIN form_return_count ON detail_content.id = form_return_count.content_id
    WHERE form_detail.form_id=$1 AND type IN ('2', '3')
    GROUP BY form_detail.index, type, title
    ORDER BY form_detail.index
    `;
    let params = [id];
    let result = await pool.query(sql, params);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
  }
}
