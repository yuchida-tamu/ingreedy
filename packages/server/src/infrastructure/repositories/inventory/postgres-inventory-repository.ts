import type { IInventoryRepository } from '@/core/application/repositories/inventory.repository';
import type { Inventory } from '@/core/domain/inventory/inventory.entity';
import { db } from '@/infrastructure/database/client';

// Updated type to include ingredient fields
// (for easier mapping from joined query)
type DbInventoryWithIngredient = {
  id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  ingredient_name: string;
  ingredient_category: string;
  ingredient_created_at: Date;
  ingredient_updated_at: Date;
};

export class PostgresInventoryRepository implements IInventoryRepository {
  async findById(id: string): Promise<Inventory | null> {
    try {
      const result = await db.query<DbInventoryWithIngredient>(
        `SELECT i.id, i.ingredient_id, i.quantity, i.unit, i.user_id, i.created_at, i.updated_at,
                ing.name as ingredient_name, ing.category as ingredient_category, ing.created_at as ingredient_created_at, ing.updated_at as ingredient_updated_at
         FROM inventory i
         JOIN ingredients ing ON i.ingredient_id = ing.id
         WHERE i.id = $1`,
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
      const result = await db.query<DbInventoryWithIngredient>(
        `SELECT i.id, i.ingredient_id, i.quantity, i.unit, i.user_id, i.created_at, i.updated_at,
                ing.name as ingredient_name, ing.category as ingredient_category, ing.created_at as ingredient_created_at, ing.updated_at as ingredient_updated_at
         FROM inventory i
         JOIN ingredients ing ON i.ingredient_id = ing.id
         WHERE i.user_id = $1 AND ing.name = $2`,
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
      const result = await db.query<DbInventoryWithIngredient>(
        `SELECT i.id, i.ingredient_id, i.quantity, i.unit, i.user_id, i.created_at, i.updated_at,
                ing.name as ingredient_name, ing.category as ingredient_category, ing.created_at as ingredient_created_at, ing.updated_at as ingredient_updated_at
         FROM inventory i
         JOIN ingredients ing ON i.ingredient_id = ing.id
         WHERE i.user_id = $1 AND ing.category = $2`,
        [userId, category],
      );
      return result.map(this.mapToInventory);
    } catch (error) {
      return [];
    }
  }

  async findAll(): Promise<Inventory[]> {
    try {
      const result = await db.query<DbInventoryWithIngredient>(
        `SELECT i.id, i.ingredient_id, i.quantity, i.unit, i.user_id, i.created_at, i.updated_at,
                ing.name as ingredient_name, ing.category as ingredient_category, ing.created_at as ingredient_created_at, ing.updated_at as ingredient_updated_at
         FROM inventory i
         JOIN ingredients ing ON i.ingredient_id = ing.id
         ORDER BY i.created_at DESC`,
      );
      return result.map(this.mapToInventory);
    } catch (error) {
      return [];
    }
  }

  async create(
    inventory: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt' | 'ingredient'>,
    ingredientId: string,
  ): Promise<Inventory | null> {
    // This method will need to fetch the ingredient after insert
    try {
      const result = await db.query<DbInventoryWithIngredient>(
        `INSERT INTO inventory (ingredient_id, quantity, unit, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id, ingredient_id, quantity, unit, user_id, created_at, updated_at`,
        [ingredientId, inventory.quantity, inventory.unit, inventory.userId],
      );
      if (result.length === 0) return null;
      // Fetch the joined ingredient for the new inventory
      return await this.findById(result[0].id);
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

      await db.query(
        `UPDATE inventory 
         SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramCounter}`,
        values,
      );
      // Fetch the updated inventory with joined ingredient
      return await this.findById(id);
    } catch (error) {
      return null;
    }
  }

  async findInventoriesByUserId(userId: string): Promise<Inventory[]> {
    try {
      const result = await db.query<DbInventoryWithIngredient>(
        `SELECT i.id, i.ingredient_id, i.quantity, i.unit, i.user_id, i.created_at, i.updated_at,
                ing.name as ingredient_name, ing.category as ingredient_category, ing.created_at as ingredient_created_at, ing.updated_at as ingredient_updated_at
         FROM inventory i
         JOIN ingredients ing ON i.ingredient_id = ing.id
         WHERE i.user_id = $1
         ORDER BY i.created_at DESC`,
        [userId],
      );
      return result.map(this.mapToInventory);
    } catch (error) {
      return [];
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await db.query(`DELETE FROM inventory WHERE id = $1`, [id]);
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapToInventory(row: DbInventoryWithIngredient): Inventory {
    return {
      id: row.id,
      ingredient: {
        id: row.ingredient_id,
        name: row.ingredient_name,
        category: row.ingredient_category,
        createdAt: row.ingredient_created_at,
        updatedAt: row.ingredient_updated_at,
      },
      quantity: row.quantity,
      unit: row.unit as Inventory['unit'],
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
