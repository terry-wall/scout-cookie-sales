import { Pool } from 'pg'

let pool: Pool | null = null
let isInitializing = false

export async function getDatabase() {
  if (!pool && !isInitializing) {
    isInitializing = true
    
    try {
      // Only initialize if DATABASE_URL is available
      if (!process.env.DATABASE_URL) {
        console.warn('DATABASE_URL not provided - database features will be unavailable')
        isInitializing = false
        throw new Error('Database URL not configured')
      }

      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        // Add connection retry and timeout settings
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        max: 10,
      })
      
      // Test the connection
      const client = await pool.connect()
      client.release()
      
      // Initialize database tables in background
      initializeTables().catch(error => 
        console.error('Background table initialization failed:', error)
      )
      
      console.log('Database connection established successfully')
    } catch (error) {
      console.error('Failed to initialize database connection:', error)
      pool = null
      throw error
    } finally {
      isInitializing = false
    }
  }
  
  if (!pool) {
    throw new Error('Database not available')
  }
  
  return pool
}

// Export query function for compatibility
export async function query(text: string, params?: any[]) {
  try {
    const db = await getDatabase()
    return db.query(text, params)
  } catch (error) {
    console.error('Database query failed:', error)
    throw error
  }
}

// Export ensureDatabaseReady function
export async function ensureDatabaseReady() {
  try {
    const db = await getDatabase()
    // Test connection with a simple query with timeout
    const client = await db.connect()
    try {
      await client.query('SELECT 1')
      return true
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Database readiness check failed:', error)
    return false
  }
}

async function initializeTables() {
  if (!pool) {
    throw new Error('Database pool not initialized')
  }

  const client = await pool.connect()
  
  try {
    console.log('Initializing database tables...')
    
    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20),
        status VARCHAR(20) DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        payment_intent_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      )
    `)
    
    // Create order_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id UUID NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `)
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)
    `)
    
    console.log('Database tables initialized successfully')
  } catch (error) {
    console.error('Error initializing database tables:', error)
    throw error
  } finally {
    client.release()
  }
}

export async function closeDatabase() {
  if (pool) {
    await pool.end()
    pool = null
  }
}