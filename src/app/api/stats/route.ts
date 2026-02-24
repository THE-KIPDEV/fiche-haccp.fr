import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query, initDatabase } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await initDatabase();

    const [empResult, taskResult, logResult] = await Promise.all([
      query<RowDataPacket[]>("SELECT COUNT(*) as count FROM employees WHERE user_id = ?", [auth.userId]),
      query<RowDataPacket[]>("SELECT COUNT(*) as count FROM haccp_tasks WHERE user_id = ?", [auth.userId]),
      query<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM task_logs WHERE user_id = ? AND DATE(completed_at) = CURDATE()",
        [auth.userId]
      ),
    ]);

    return NextResponse.json({
      employees: empResult[0]?.count || 0,
      tasks: taskResult[0]?.count || 0,
      logsToday: logResult[0]?.count || 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ employees: 0, tasks: 0, logsToday: 0 });
  }
}
