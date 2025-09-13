import { sql } from "bun"

await sql.file('sql/init.sql')
