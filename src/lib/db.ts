import { Pool } from 'pg'

let db: Pool | null = null

function getConnectionString() {
  return (
    process.env.NEON_DATABASE_URL ||
    process.env.NEON_DB_URL ||
    process.env.NEON_POSTGRES_URL ||
    ''
  )
}

export function getDb() {
  if (!db) {
    const connectionString = getConnectionString()

    if (!connectionString) {
      throw new Error(
        'Missing Neon database connection string. Set NEON_DATABASE_URL, NEON_DB_URL, or NEON_POSTGRES_URL.'
      )
    }

    db = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  }

  return db
}
