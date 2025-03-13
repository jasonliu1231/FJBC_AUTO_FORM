import pool from "../../../sql_conn/activity";

export default async function GetListAPI(req, res) {
  const id = req.query.id;
  try {
    let sql = `SELECT title FROM form_detail WHERE form_id=$1 ORDER BY index`;
    let params = [id];
    let title = await pool.query(sql, params);

    let str = "";
    for (let i = 0; i < title.rows.length; i++) {
      str += `items${i}, `;
    }

    sql = `SELECT ${str} create_at FROM form_return_list WHERE form_id=$1 ORDER BY create_at DESC`;
    params = [id];
    let list = await pool.query(sql, params);

    let title_list = [];
    title.rows.forEach((item) => {
      title_list.push(item.title);
    });

    res.status(200).json({
      form_title: title_list,
      form_return_list: list.rows
    });
  } catch (error) {
    console.error(error);
  }
}
