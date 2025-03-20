import pool from "../../../sql_conn/activity";

export default async function CreateAPI(req, res) {
  const body = req.body;

  try {
    await pool.query("BEGIN");
    // 新增主體
    let sql = `
      INSERT INTO form(name, banner, content, deadline, auto_open, auto_close, department_id, category_id, finish_photo, finish_message)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
    `;
    let params = [body.name, body.banner, body.content, body.deadline, body.auto_open, body.auto_close, body.department_id, body.category_id, body.finish_photo, body.finish_message];
    let form = await pool.query(sql, params);

    // 新增選項
    for (let i = 0; i < body.detail.length; i++) {
      sql = `
        INSERT INTO form_detail(form_id, index, type, required, title, enable)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `;
      params = [form.rows[0].id, i, body.detail[i].type, body.detail[i].required, body.detail[i].title, body.detail[i].enable];
      let detail = await pool.query(sql, params);
      for (let j = 0; j < body.detail[i].content.length; j++) {
        const content = body.detail[i].content;
        sql = `
        INSERT INTO detail_content(detail_id, index, content, other_input)
        VALUES ($1, $2, $3, $4)
        `;
        params = [detail.rows[0].id, j, content[j].content, content[j].other_input];
        await pool.query(sql, params);
      }
    }
    await pool.query("COMMIT");
    res.status(200).json({});
  } catch (error) {
    console.error(error);
  }
}
