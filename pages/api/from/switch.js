import pool from "../../../sql_conn/activity";
import List from "./list";

export default async function SwitchAPI(req, res) {
  const body = req.body;
  try {
    let sql = `
        UPDATE form SET enable=$1 WHERE id=$2
    `;
    let params = [body.enable, body.id];
    await pool.query(sql, params);
    await List(req, res);
  } catch (error) {
    console.error(error);
  }
}
