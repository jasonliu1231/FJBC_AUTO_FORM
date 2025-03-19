import pool from "../../../sql_conn/activity";

export default async function SaveAPI(req, res) {
  const body = req.body;
  try {
    await pool.query("BEGIN");

    let sql = `SELECT deadline FROM form WHERE id=$1`;
    let params = [body.form_id];
    let result = await pool.query(sql, params);

    if (result.rows[0]?.deadline) {
      if (new Date(result.rows[0]?.deadline) < new Date()) {
        res.status(400).json({
          msg: "感謝您的支持，非常抱歉活動已結束！"
        });
      }
    }

    sql = `
        INSERT INTO form_return_list(form_id, items0, items1, items2, items3, items4, items5, items6, items7, items8, items9)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;
    params = [
      body.form_id,
      body.items0 ? (Array.isArray(body.items0.content_value) ? body.items0.content_value.join(", ") : body.items0.content_value) : null,
      body.items1 ? (Array.isArray(body.items1.content_value) ? body.items1.content_value.join(", ") : body.items1.content_value) : null,
      body.items2 ? (Array.isArray(body.items2.content_value) ? body.items2.content_value.join(", ") : body.items2.content_value) : null,
      body.items3 ? (Array.isArray(body.items3.content_value) ? body.items3.content_value.join(", ") : body.items3.content_value) : null,
      body.items4 ? (Array.isArray(body.items4.content_value) ? body.items4.content_value.join(", ") : body.items4.content_value) : null,
      body.items5 ? (Array.isArray(body.items5.content_value) ? body.items5.content_value.join(", ") : body.items5.content_value) : null,
      body.items6 ? (Array.isArray(body.items6.content_value) ? body.items6.content_value.join(", ") : body.items6.content_value) : null,
      body.items7 ? (Array.isArray(body.items7.content_value) ? body.items7.content_value.join(", ") : body.items7.content_value) : null,
      body.items8 ? (Array.isArray(body.items8.content_value) ? body.items8.content_value.join(", ") : body.items8.content_value) : null,
      body.items9 ? (Array.isArray(body.items9.content_value) ? body.items9.content_value.join(", ") : body.items9.content_value) : null
    ];
    await pool.query(sql, params);

    for (let i = 0; i < 19; i++) {
      const items = body[`items${i}`];
      const isEmpty = items === undefined ? false : true;

      if (isEmpty) {
        if (items.type == "2") {
          if (items.content_id) {
            await saveCount(body.form_id, items.content_id);
          }
        } else if (items.type == "3") {
          const content_id = items.content_id;
          for (let j = 0; j < content_id.length; j++) {
            await saveCount(body.form_id, content_id[j]);
          }
        }
      }
    }
    await pool.query("COMMIT");

    res.status(200).json({});
  } catch (error) {
    console.error(error);
  }
}

async function saveCount(form_id, content_id) {
  let sql = `SELECT count FROM form_return_count WHERE form_id=$1 AND content_id=$2`;
  let params = [form_id, content_id];
  let result = await pool.query(sql, params);
  if (result.rows.length == 0) {
    sql = `
          INSERT INTO form_return_count(form_id, content_id, count) VALUES ($1, $2, $3)
      `;
    params = [form_id, content_id, 1];
    await pool.query(sql, params);
  } else {
    sql = `
          UPDATE form_return_count SET count=$3 WHERE form_id=$1 AND content_id=$2
      `;
    params = [form_id, content_id, result.rows[0].count + 1];
    await pool.query(sql, params);
  }
}
