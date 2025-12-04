import { config } from "./index.js";
import mysql from 'mysql2/promise';
const dbConfig = {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    port: parseInt(config.DB_PORT),
    // Prod tweaks: SSL, charset
    ssl: config.NODE_ENV === 'development' ? undefined : { rejectUnauthorized: false },
    charset: 'utf8mb4',
    // Pool limits (tune based on your MySQL max_connections, e.g., 1000 total)
    connectionLimit: 20,  // Per cluster worker
    acquireTimeout: 60000,  // 1 min to get connection
    timeout: 60000,         // Idle timeout
    waitForConnections: true,
    queueLimit: 0,          // Unlimited queue (or set to 50 to fail fast)
    // Retry on connection errors
    reconnect: true,
};

let pool;

// Retry wrapper for transient errors
async function createConnectionWithRetry(retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            pool = mysql.createPool(dbConfig);
            // Test pool
            await pool.execute('SELECT 1');
            console.log('DB pool initialized');
            return pool;
        } catch (err) {
            console.error(`DB init retry ${i + 1}/${retries}:`, err.message);
            if (i === retries - 1) throw err;
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));  // Exponential backoff
        }
    }
}

export async function initPool() {
    if (!pool) {
        await createConnectionWithRetry();
    }
    return pool;
}

export async function closePool() {
    if (pool) {
        await pool.end();
        console.log('DB pool closed');
    }
}

export const getPool = () => pool;

// Graceful shutdown hook
process.on('SIGTERM', closePool);
process.on('SIGINT', closePool);


export async function executeQuery(sql, params = []) {
    const pool = await getPool();  // Ensure initialized
    try {
        const [rows] = await pool.execute(sql, params);  // Prepared statement
        return rows;
    } catch (err) {
        console.error('Query error:', err);
        throw err;  // Re-throw for caller handling
    }
}

export async function insertRecord(table, data) {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const params = keys.map(key => data[key]);
    const result = await executeQuery(sql, params);
    return { insertId: result.insertId, affectedRows: result.affectedRows };
}

export async function selectRecord(table, whereClause = {}, options = { limit: 1 }) {
    let sql = `SELECT * FROM ${table}`;
    const params = [];
    if (Object.keys(whereClause).length > 0) {
        const whereParts = Object.keys(whereClause).map(key => `${key} = ?`);
        sql += ` WHERE ${whereParts.join(' AND ')}`;
        params.push(...Object.values(whereClause));
    }
    if (options.limit) sql += ` LIMIT ${options.limit}`;
    return await executeQuery(sql, params);
}

export async function updateRecord(table, data, whereClause) {
    const setParts = Object.keys(data).map(key => `${key} = ?`);
    const sql = `UPDATE ${table} SET ${setParts.join(', ')} WHERE ${Object.keys(whereClause).map(key => `${key} = ?`).join(' AND ')}`;
    const params = [...Object.values(data), ...Object.values(whereClause)];
    const result = await executeQuery(sql, params);
    return { affectedRows: result.affectedRows };
}

export async function deleteRecord(table, whereClause) {
    const whereParts = Object.keys(whereClause).map(key => `${key} = ?`);
    const sql = `DELETE FROM ${table} WHERE ${whereParts.join(' AND ')}`;
    const params = Object.values(whereClause);
    const result = await executeQuery(sql, params);
    return { affectedRows: result.affectedRows };
}

// Export for transactions (bonus)
export async function withTransaction(fn) {
    const pool = await getPool();
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await fn(connection);
        await connection.commit();
        return result;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}