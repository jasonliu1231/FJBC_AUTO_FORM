import pool from "../../../sql_conn/activity";
import Detail from "./detail";

export default async function UpdateAPI(req, res) {
  const body = req.body;

  try {
    await pool.query("BEGIN");
    // let sql = `
    //     SELECT id FROM form_return_list WHERE form_id = $1
    // `;
    // let params = [body.id];
    // let result = await pool.query(sql, params);

    // if (result.rows.length > 0) {
    //   res.status(400).json({
    //     msg: "表單已有人填寫，無法修改！"
    //   });
    //   return;
    // }

    let sql = `
      UPDATE form SET name=$1, banner=$2, content=$3, deadline=$4, auto_open=$5, auto_close=$6, department_id=$7, category_id=$9, finish_photo=$10, finish_message=$11 WHERE id =$8
    `;
    let params = [body.name, body.banner, body.content, body.deadline, body.auto_open, body.auto_close, body.department_id, body.id, body.category_id, body.finish_photo, body.finish_message];
    await pool.query(sql, params);

    for (let i = 0; i < body.detail.length; i++) {
      sql = `SELECT id FROM form_detail WHERE id = $1`;
      let result = await pool.query(sql, [body.detail[i].id]);
      if (result.rows.length == 0) {
        sql = `
          INSERT INTO form_detail(form_id, index, type, required, title, enable)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `;
        params = [body.id, body.detail[i].index, body.detail[i].type, body.detail[i].required, body.detail[i].title, body.detail[i].enable];
        let detail = await pool.query(sql, params);
        for (let j = 0; j < body.detail[i].content.length; j++) {
          const content = body.detail[i].content[j];
          sql = `
          INSERT INTO detail_content(detail_id, index, content, enable)
          VALUES ($1, $2, $3, $4) RETURNING id
          `;
          params = [detail.rows[0].id, j, content.content, content.enable];
          await pool.query(sql, params);
        }
      } else {
        sql = `UPDATE form_detail SET type=$1, required=$2, title=$3, enable=$4, index=$6 WHERE id=$5`;
        params = [body.detail[i].type, body.detail[i].required, body.detail[i].title, body.detail[i].enable, body.detail[i].id, body.detail[i].index];
        await pool.query(sql, params);
        console.log(body.detail[i].content);
        for (let j = 0; j < body.detail[i].content.length; j++) {
          const content = body.detail[i].content[j];
          sql = `SELECT id FROM detail_content WHERE id=$1 AND detail_id=$2`;
          params = [content.content_id, body.detail[i].id];
          result = await pool.query(sql, params);
          if (result.rows.length == 0) {
            if (content.enable) sql = `INSERT INTO detail_content(detail_id, index, content, enable) VALUES ($1, $2, $3, $4)`;
            params = [body.detail[i].id, j, content.content, content.enable];
            await pool.query(sql, params);
          } else {
            sql = `UPDATE detail_content SET content=$1, enable=$4 WHERE id=$2 AND detail_id=$3`;
            params = [content.content, content.content_id, body.detail[i].id, content.enable];
            await pool.query(sql, params);
          }
        }
      }
    }
    await pool.query("COMMIT");
    await res.status(200).json({});
  } catch (error) {
    console.error(error);
    if (error.code == "23505") {
      res.status(400).json({ msg: "欄位不可以空白" });
    }
  }
}
