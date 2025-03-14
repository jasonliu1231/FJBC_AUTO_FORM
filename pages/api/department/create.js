import pool from "../../../sql_conn/activity";
import GetDepartmentListAPI from "./list";

export default async function PostDepartmentListAPI(req, res) {
  const name = req.body.name;
  try {
    let sql = `INSERT INTO form_department(name)VALUES ($1)`;
    let result = await pool.query(sql, [name]);
    GetDepartmentListAPI(req, res);
  } catch (error) {
    console.error(error);
  }
}
