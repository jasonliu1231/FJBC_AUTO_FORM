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

    // 設定要插入的 items 數量
    const itemCount = 50;

    // 動態生成 SQL 欄位名稱
    const itemColumns = Array.from({ length: itemCount }, (_, i) => `items${i}`).join(", ");

    // 動態生成 VALUES 參數占位符
    const valuePlaceholders = Array.from({ length: itemCount + 1 }, (_, i) => `$${i + 1}`).join(", ");

    // 組合 SQL 語法
    sql = `
    INSERT INTO form_return_list (form_id, ${itemColumns})
    VALUES (${valuePlaceholders})
`;

    params = [
      body.form_id,
      ...Array.from({ length: itemCount }, (_, i) => {
        const item = body[`items${i}`];
        return item ? (Array.isArray(item.content_value) ? item.content_value.join(", ") : item.content_value) : null;
      })
    ];

    console.log(sql); // 可以先檢查一下 SQL 是否正確
    await pool.query(sql, params);

    for (let i = 0; i < 50; i++) {
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
