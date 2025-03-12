import pool from "../../../sql_conn/activity";
import Detail from "./detail";

export default async function UpdateAPI(req, res) {
  const body = req.body;

  try {
    await pool.query("BEGIN");
    // 新增主體
    let sql = `
      UPDATE form SET name=$1, banner=$2, content=$3, deadline=$4, auto_open=$5, auto_close=$6, department=$7 WHERE id =$8
    `;
    let params = [body.name, body.banner, body.content, body.deadline, body.auto_open, body.auto_close, body.department, body.id];
    await pool.query(sql, params);

    // 新增選項
    for (let i = 0; i < body.detail.length; i++) {
      sql = `SELECT * FROM form_detail WHERE id = $1`;
      let result = await pool.query(sql, [body.detail[i].id]);
      if (result.rows.length == 0) {
        sql = `
        INSERT INTO form_detail(form_id, index, type, required, title, enable)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `;
        params = [body.id, i, body.detail[i].type, body.detail[i].required, body.detail[i].title, body.detail[i].enable];
        let detail = await pool.query(sql, params);
        for (let j = 0; j < body.detail[i].content.length; j++) {
          sql = `
          INSERT INTO detail_content(detail_id, index, content)
          VALUES ($1, $2, $3) RETURNING id
          `;
          params = [detail.rows[0].id, j, body.detail[i].content[j]];
          await pool.query(sql, params);
        }
      } else {
        sql = `
        UPDATE form_detail SET type=$1, required=$2, title=$3, enable=$4 WHERE id=$5
        `;
        params = [body.detail[i].type, body.detail[i].required, body.detail[i].title, body.detail[i].enable, body.detail[i].id];
        await pool.query(sql, params);
        sql = `DELETE FROM detail_content WHERE detail_id=$1`;
        await pool.query(sql, [body.detail[i].id]);
        for (let j = 0; j < body.detail[i].content.length; j++) {
          sql = `INSERT INTO detail_content(detail_id, index, content) VALUES ($1, $2, $3)`;
          params = [body.detail[i].id, j, body.detail[i].content[j]];
          await pool.query(sql, params);
        }
      }
    }
    await pool.query("COMMIT");
    await Detail(req, res);
  } catch (error) {
    console.error(error);
  }
}
