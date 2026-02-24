import { NextRequest, NextResponse } from "next/server";
import { query, initDatabase } from "@/lib/db";
import { sendMail, dailyReminderEmailHtml } from "@/lib/mail";
import { RowDataPacket } from "mysql2";

const CATEGORY_LABELS: Record<string, string> = {
  temperatures: "Temperatures",
  nettoyage: "Nettoyage",
  tracabilite: "Tracabilite",
  reception: "Reception",
  equipement: "Equipement",
  general: "General",
};

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();
    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDatabase();

    const users = await query<RowDataPacket[]>(
      `SELECT id, name, email FROM users
       WHERE subscription_status = 'active'
       AND reminder_enabled = 1`
    );

    let sentCount = 0;

    for (const user of users) {
      const tasks = await query<RowDataPacket[]>(
        `SELECT t.id, t.title, t.frequency, t.category,
                (SELECT MAX(tl.completed_at) FROM task_logs tl WHERE tl.task_id = t.id) as last_completed_at
         FROM haccp_tasks t
         WHERE t.user_id = ? AND t.active = 1`,
        [user.id]
      );

      const overdueTasks = tasks.filter((t) => {
        if (t.frequency === "ponctuel" && t.last_completed_at) return false;
        if (!t.last_completed_at) return t.frequency !== "ponctuel";

        const daysSince = Math.floor(
          (Date.now() - new Date(t.last_completed_at).getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (t.frequency) {
          case "quotidien": return daysSince >= 1;
          case "hebdomadaire": return daysSince >= 7;
          case "mensuel": return daysSince >= 30;
          default: return false;
        }
      });

      if (overdueTasks.length > 0) {
        const emailTasks = overdueTasks.map((t) => ({
          title: t.title,
          category: CATEGORY_LABELS[t.category] || t.category,
          daysSinceLastDone: t.last_completed_at
            ? Math.floor((Date.now() - new Date(t.last_completed_at).getTime()) / (1000 * 60 * 60 * 24))
            : 0,
        }));

        try {
          await sendMail({
            to: user.email,
            toName: user.name,
            subject: `${overdueTasks.length} tache${overdueTasks.length > 1 ? "s" : ""} HACCP en attente`,
            html: dailyReminderEmailHtml(user.name, emailTasks),
          });
          sentCount++;
        } catch {
          // Non-blocking per user
        }
      }
    }

    return NextResponse.json({ sent: sentCount, checked: users.length });
  } catch (error) {
    console.error("Cron reminders error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
