import type { IInventoryRepository } from '@/core/application/repositories/inventory.repository';
import type { Inventory } from '@/core/domain/inventory/inventory.entity';
import { db } from '@/infrastructure/database/client';

type DbInventory = {
  id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  user_id: string; // Include the new userId parameter in DbInventory
  created_at: Date;
  updated_at: Date;
};

export class PostgresInventoryRepository implements IInventoryRepository {
  async findById(id: string): Promise<Inventory | null> {
    try {
      const result = await db.query<DbInventory>(
        `SELECT id, ingredient_id, quantity, unit, user_id, created_at, updated_at 
         FROM inventory 
         WHERE id = $1`,
        [id],
      );

      if (result.length === 0) {
        return null;
      }

      return this.mapToInventory(result[0]);
    } catch (error) {
      return null;
    }
  }

  async findInventoryByName(userId: string, name: string): Promise<Inventory | null> {
    try {
      const result = await db.query<DbInventory>(
        `SELECT id, ingredient_id, quantity, unit, user_id, created_at, updated_at 
         FROM inventory 
         WHERE user_id = $1 AND ingredient_id = (SELECT id FROM ingredients WHERE name = $2)`,
        [userId, name],
      );

      if (result.length === 0) {
        return null;
      }

      return this.mapToInventory(result[0]);
    } catch (error) {
      return null;
    }
  }

  async findInventoryByCategory(userId: string, category: string): Promise<Inventory[]> {
    try {
      const result = await db.query<DbInventory>(
        `SELECT id, ingredient_id, quantity, unit, user_id, created_at, updated_at 
         FROM inventory 
         WHERE user_id = $1 AND ingredient_id IN (SELECT id FROM ingredients WHERE category = $2)`,
        [userId, category],
      );

      return result.map(this.mapToInventory);
    } catch (error) {
      return [];
    }
  }

  async findAll(): Promise<Inventory[]> {
    try {
      const result = await db.query<DbInventory>(
        `SELECT id, ingredient_id, quantity, unit, user_id, created_at, updated_at 
         FROM inventory 
         ORDER BY created_at DESC`,
      );

      return result.map(this.mapToInventory);
    } catch (error) {
      return [];
    }
  }

  async create(
    inventory: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Inventory | null> {
    try {
      const result = await db.query<DbInventory>(
        `INSERT INTO inventory (ingredient_id, quantity, unit, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id, ingredient_id, quantity, unit, user_id, created_at, updated_at`,
        [inventory.ingredientId, inventory.quantity, inventory.unit, inventory.userId],
      );

      return this.mapToInventory(result[0]);
    } catch (error) {
      return null;
    }
  }

  async update(
    id: string,
    data: Partial<Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Inventory | null> {
    try {
      const setClause: string[] = [];
      const values: unknown[] = [];
      let paramCounter = 1;

      if (data.quantity !== undefined) {
        setClause.push(`quantity = $${paramCounter}`);
        values.push(data.quantity);
        paramCounter++;
      }
      if (data.unit) {
        setClause.push(`unit = $${paramCounter}`);
        values.push(data.unit);
        paramCounter++;
      }

      if (setClause.length === 0) {
        return null;
      }

      values.push(id);

      const result = await db.query<DbInventory>(
        `UPDATE inventory 
         SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramCounter}
         RETURNING id, ingredient_id, quantity, unit, user_id, created_at, updated_at`,
        values,
      );

      if (result.length === 0) {
        return null;
      }

      return this.mapToInventory(result[0]);
    } catch (error) {
      return null;
    }
  }

  async findInventoriesByUserId(userId: string): Promise<Inventory[]> {
    try {
      const result = await db.query<DbInventory>(
        `SELECT id, ingredient_id, quantity, unit, user_id, created_at, updated_at 
         FROM inventory 
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId],
      );
      return result.map(this.mapToInventory);
    } catch (error) {
      return [];
    }
  }

  private mapToInventory(row: DbInventory): Inventory {
    return {
      id: row.id,
      ingredientId: row.ingredient_id,
      quantity: row.quantity,
      unit: row.unit as Inventory['unit'],
      userId: row.user_id, // Include the new userId parameter
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
