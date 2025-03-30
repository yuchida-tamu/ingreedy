import { DatabaseError } from '@/infrastructure/database/database-error';
import { IUserRepository } from '../../../core/application/repositories/user.repository';
import { User } from '../../../core/domain/user/user.entity';
import { db } from '../../database/client';

/**
 * PostgreSQL implementation of the user repository.
 * Handles all user-related database operations using PostgreSQL.
 */
export class PostgresUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const row = await db.queryOne<Record<string, unknown>>('SELECT * FROM users WHERE id = $1', [
        id,
      ]);
      return row ? this.mapToUser(row) : null;
    } catch (error) {
      throw new DatabaseError('Failed to find user by ID', error);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      // Use case-insensitive search since we have an index for it
      const row = await db.queryOne<Record<string, unknown>>(
        'SELECT * FROM users WHERE lower(email) = lower($1)',
        [email],
      );
      return row ? this.mapToUser(row) : null;
    } catch (error) {
      throw new DatabaseError('Failed to find user by email', error);
    }
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const row = await db.queryOne<Record<string, unknown>>(
        `
        INSERT INTO users (
          email,
          username,
          password
        ) VALUES (
          $1, $2, $3
        )
        RETURNING *
        `,
        [user.email, user.username, user.password],
      );

      if (!row) {
        throw new DatabaseError('Failed to create user: No result returned');
      }

      return this.mapToUser(row);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Failed to create user', error);
    }
  }

  /**
   * Maps a database row to a User domain entity.
   * Handles conversion from snake_case column names to camelCase properties
   * and ensures proper date parsing.
   */
  private mapToUser(row: Record<string, unknown>): User {
    return {
      id: row.id as string,
      email: row.email as string,
      username: row.username as string,
      password: row.password as string,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }
}
