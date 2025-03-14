import pool from "../../../sql_conn/activity";

export default async function categoryAPI(req, res) {
  try {
    let sql = `SELECT id, name, enable, create_at FROM form_category`;
    let result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
  }
}
