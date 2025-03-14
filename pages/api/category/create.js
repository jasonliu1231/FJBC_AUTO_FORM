import pool from "../../../sql_conn/activity";
import GetCategoryAPI from "./list";

export default async function categoryAPI(req, res) {
  const name = req.body.name;
  try {
    let sql = `INSERT INTO form_category(name) VALUES ($1)`;
    let result = await pool.query(sql, [name]);
    GetCategoryAPI(req, res);
  } catch (error) {
    console.error(error);
  }
}
