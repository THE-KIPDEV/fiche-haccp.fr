import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    const url = process.env.MYSQL_URL;
    if (!url) throw new Error("MYSQL_URL manquant dans les variables d'environnement");
    pool = mysql.createPool({
      uri: url,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const p = getPool();
  const [rows] = await p.execute(sql, params ?? []);
  return rows as T;
}

export async function initDatabase(): Promise<void> {
  const p = getPool();

  await p.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      restaurant_name VARCHAR(255) DEFAULT '',
      stripe_customer_id VARCHAR(255) DEFAULT NULL,
      subscription_status ENUM('none','active','canceled','past_due') DEFAULT 'none',
      subscription_id VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_stripe_customer (stripe_customer_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.execute(`
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.execute(`
    CREATE TABLE IF NOT EXISTS haccp_tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      frequency ENUM('quotidien','hebdomadaire','mensuel','ponctuel') DEFAULT 'quotidien',
      category VARCHAR(100) DEFAULT 'general',
      assigned_employee_id INT DEFAULT NULL,
      active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_employee_id) REFERENCES employees(id) ON DELETE SET NULL,
      INDEX idx_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.execute(`
    CREATE TABLE IF NOT EXISTS task_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      task_id INT NOT NULL,
      employee_id INT DEFAULT NULL,
      user_id INT NOT NULL,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      notes TEXT DEFAULT NULL,
      temperature DECIMAL(5,2) DEFAULT NULL,
      conformity TINYINT(1) DEFAULT 1,
      FOREIGN KEY (task_id) REFERENCES haccp_tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_task (task_id),
      INDEX idx_user (user_id),
      INDEX idx_date (completed_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.execute(`
    CREATE TABLE IF NOT EXISTS downloads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      fiche_slug VARCHAR(100) NOT NULL,
      downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Migrations — add columns/indexes to existing tables
  try {
    await p.execute("ALTER TABLE users ADD COLUMN reminder_enabled TINYINT(1) DEFAULT 1");
  } catch {
    // Column already exists
  }
  try {
    await p.execute("ALTER TABLE task_logs ADD INDEX idx_task_completed (task_id, completed_at)");
  } catch {
    // Index already exists
  }

  // Billing info columns
  try { await p.execute("ALTER TABLE users ADD COLUMN billing_name VARCHAR(255) DEFAULT NULL"); } catch { /* exists */ }
  try { await p.execute("ALTER TABLE users ADD COLUMN billing_address TEXT DEFAULT NULL"); } catch { /* exists */ }
  try { await p.execute("ALTER TABLE users ADD COLUMN billing_siret VARCHAR(50) DEFAULT NULL"); } catch { /* exists */ }
  try { await p.execute("ALTER TABLE users ADD COLUMN billing_tva_number VARCHAR(50) DEFAULT NULL"); } catch { /* exists */ }

  await p.execute(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      invoice_number VARCHAR(50) NOT NULL UNIQUE,
      stripe_invoice_id VARCHAR(255) DEFAULT NULL,
      description VARCHAR(500) NOT NULL,
      amount_cents INT NOT NULL,
      period_start DATE DEFAULT NULL,
      period_end DATE DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.execute(`
    CREATE TABLE IF NOT EXISTS pdf_preferences (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      fiche_slug VARCHAR(100) NOT NULL,
      restaurant_name VARCHAR(255) DEFAULT '',
      logo_base64 MEDIUMTEXT DEFAULT NULL,
      logo_mime_type VARCHAR(50) DEFAULT NULL,
      header_color VARCHAR(7) DEFAULT '#065f46',
      orientation ENUM('portrait','landscape') DEFAULT 'portrait',
      row_count INT DEFAULT 30,
      selected_fields JSON DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY uk_user_fiche (user_id, fiche_slug),
      INDEX idx_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
