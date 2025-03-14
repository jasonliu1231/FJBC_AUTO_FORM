import pool from "../../../sql_conn/activity";
import GetCategoryAPI from "./list";

export default async function categoryAPI(req, res) {
  const body = req.body;
  try {
    let sql = `UPDATE form_category SET name=$1 WHERE id=$2`;
    await pool.query(sql, [body.name, body.id]);
    GetCategoryAPI(req, res);
  } catch (error) {
    console.error(error);
  }
}
