import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query, initDatabase } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await initDatabase();

    const [empResult, taskResult, logResult, completionResult] = await Promise.all([
      query<RowDataPacket[]>("SELECT COUNT(*) as count FROM employees WHERE user_id = ?", [auth.userId]),
      query<RowDataPacket[]>("SELECT COUNT(*) as count FROM haccp_tasks WHERE user_id = ? AND active = 1", [auth.userId]),
      query<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM task_logs WHERE user_id = ? AND DATE(completed_at) = CURDATE()",
        [auth.userId]
      ),
      query<RowDataPacket[]>(
        `SELECT COUNT(DISTINCT t.id) as completed
         FROM haccp_tasks t
         JOIN task_logs tl ON tl.task_id = t.id AND DATE(tl.completed_at) = CURDATE()
         WHERE t.user_id = ? AND t.active = 1`,
        [auth.userId]
      ),
    ]);

    const totalTasks = taskResult[0]?.count || 0;
    const completedToday = completionResult[0]?.completed || 0;

    return NextResponse.json({
      employees: empResult[0]?.count || 0,
      tasks: totalTasks,
      logsToday: logResult[0]?.count || 0,
      completionToday: {
        total: totalTasks,
        completed: completedToday,
        percent: totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ employees: 0, tasks: 0, logsToday: 0 });
  }
}
