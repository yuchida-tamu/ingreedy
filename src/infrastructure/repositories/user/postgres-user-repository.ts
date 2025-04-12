import type { IUserRepository } from '@/core/application/repositories/user.repository';
import type { User } from '@/core/domain/user/user.entity';
import { db } from '@/infrastructure/database/client';
import { DatabaseError } from '@/infrastructure/database/database-error';

type DbUser = {
  id: string;
  email: string;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
};

/**
 * PostgreSQL implementation of the user repository.
 * Handles all user-related database operations using PostgreSQL.
 */
export class PostgresUserRepository implements IUserRepository {
  async findById(id: string) {
    try {
      const result = await db.query<DbUser>(
        `SELECT id, email, username, password, created_at, updated_at 
         FROM users 
         WHERE id = $1`,
        [id],
      );

      if (result.length === 0) {
        return null;
      }

      return this.mapToUser(result[0]);
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string) {
    try {
      const result = await db.query<DbUser>(
        `SELECT id, email, username, password, created_at, updated_at 
         FROM users 
         WHERE email = $1`,
        [email],
      );

      if (result.length === 0) {
        return null;
      }

      return this.mapToUser(result[0]);
    } catch (error) {
      return null
    }
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const result = await db.query<DbUser>(
        `INSERT INTO users (email, username, password)
         VALUES ($1, $2, $3)
         RETURNING id, email, username, password, created_at, updated_at`,
        [data.email, data.username, data.password],
      );

      return this.mapToUser(result[0]);
    } catch (error) {
      throw new DatabaseError('Failed to create user', error);
    }
  }

  async update(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
  ){
    try {
      const setClause: string[] = [];
      const values: unknown[] = [];
      let paramCounter = 1;

      // Build SET clause dynamically based on provided fields
      if (data.email) {
        setClause.push(`email = $${paramCounter}`);
        values.push(data.email);
        paramCounter++;
      }
      if (data.username) {
        setClause.push(`username = $${paramCounter}`);
        values.push(data.username);
        paramCounter++;
      }
      if (data.password) {
        setClause.push(`password = $${paramCounter}`);
        values.push(data.password);
        paramCounter++;
      }

      if (setClause.length === 0) {
        return null; // No fields to update
      }

      // Add id as the last parameter
      values.push(id);

      const result = await db.query<DbUser>(
        `UPDATE users 
         SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramCounter}
         RETURNING id, email, username, password, created_at, updated_at`,
        values,
      );

      if (result.length === 0) {
        throw null;
      }

      return this.mapToUser(result[0]);
    } catch (error) {
      return null;
    }
  }

  /**
   * Maps a database row to a User domain entity.
   * Handles conversion from snake_case column names to camelCase properties
   * and ensures proper date parsing.
   */
  private mapToUser(row: DbUser): User {
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      password: row.password,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
