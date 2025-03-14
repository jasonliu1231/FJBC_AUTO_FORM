import pool from "../../../sql_conn/activity";
import GetDepartmentListAPI from "./list";

export default async function PostDepartmentListAPI(req, res) {
  const body = req.body;
  try {
    let sql = `UPDATE form_department SET name=$1 WHERE id=$2`;
    await pool.query(sql, [body.name, body.id]);
    GetDepartmentListAPI(req, res);
  } catch (error) {
    console.error(error);
  }
}
