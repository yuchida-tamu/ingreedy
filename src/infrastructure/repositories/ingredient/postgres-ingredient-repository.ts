import type { IIngredientRepository } from '@/core/application/repositories/ingredient.repository';
import type { Ingredient } from '@/core/domain/inventory/ingredient.entity';
import { db } from '@/infrastructure/database/client';
import { DatabaseError } from '@/infrastructure/database/database-error';

type DbIngredient = {
  id: string;
  name: string;
  category: string;
  created_at: Date;
  updated_at: Date;
};

export class PostgresIngredientRepository implements IIngredientRepository {
  async findById(id: string): Promise<Ingredient | null> {
    try {
      const result = await db.query<DbIngredient>(
        `SELECT id, name, category, created_at, updated_at 
         FROM ingredients 
         WHERE id = $1`,
        [id],
      );

      if (result.length === 0) {
        return null;
      }

      return this.mapToIngredient(result[0]);
    } catch (error) {
      throw new DatabaseError('Failed to find ingredient by ID', error);
    }
  }

  async findByName(name: string): Promise<Ingredient | null> {
    try {
      const result = await db.query<DbIngredient>(
        `SELECT id, name, category, created_at, updated_at 
         FROM ingredients 
         WHERE name = $1`,
        [name],
      );

      if (result.length === 0) {
        return null;
      }

      return this.mapToIngredient(result[0]);
    } catch (error) {
      throw new DatabaseError('Failed to find ingredient by name', error);
    }
  }

  async findByCategory(category: string): Promise<Ingredient[]> {
    try {
      const result = await db.query<DbIngredient>(
        `SELECT id, name, category, created_at, updated_at 
         FROM ingredients 
         WHERE category = $1
         ORDER BY name ASC`,
        [category],
      );

      return result.map(this.mapToIngredient);
    } catch (error) {
      throw new DatabaseError('Failed to find ingredients by category', error);
    }
  }

  async findAll(): Promise<Ingredient[]> {
    try {
      const result = await db.query<DbIngredient>(
        `SELECT id, name, category, created_at, updated_at 
         FROM ingredients 
         ORDER BY name ASC`,
      );

      return result.map(this.mapToIngredient);
    } catch (error) {
      throw new DatabaseError('Failed to find all ingredients', error);
    }
  }

  async create(
    ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Ingredient> {
    try {
      const result = await db.query<DbIngredient>(
        `INSERT INTO ingredients (name, category)
         VALUES ($1, $2)
         RETURNING id, name, category, created_at, updated_at`,
        [ingredient.name, ingredient.category],
      );

      return this.mapToIngredient(result[0]);
    } catch (error) {
      throw new DatabaseError('Failed to create ingredient', error);
    }
  }

  async update(
    id: string,
    data: Partial<Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Ingredient> {
    try {
      const setClause: string[] = [];
      const values: unknown[] = [];
      let paramCounter = 1;

      // Build SET clause dynamically based on provided fields
      if (data.name) {
        setClause.push(`name = $${paramCounter}`);
        values.push(data.name);
        paramCounter++;
      }
      if (data.category) {
        setClause.push(`category = $${paramCounter}`);
        values.push(data.category);
        paramCounter++;
      }

      if (setClause.length === 0) {
        throw new DatabaseError('No fields to update');
      }

      // Add id as the last parameter
      values.push(id);

      const result = await db.query<DbIngredient>(
        `UPDATE ingredients 
         SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramCounter}
         RETURNING id, name, category, created_at, updated_at`,
        values,
      );

      if (result.length === 0) {
        throw new DatabaseError('Ingredient not found');
      }

      return this.mapToIngredient(result[0]);
    } catch (error) {
      throw new DatabaseError('Failed to update ingredient', error);
    }
  }

  private mapToIngredient(row: DbIngredient): Ingredient {
    return {
      id: row.id,
      name: row.name,
      category: row.category as Ingredient['category'],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
