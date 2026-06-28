import db from '../../config/database';

export interface Category {
  id: string;
  name: string;
  photo: string | null;
  barbershopId: string | null;
  ownerId: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryFilters {
  ownerId: string;
  barbershopId?: string;
}

export const categoriesRepository = {
  async findAll(filters: CategoryFilters): Promise<Category[]> {
    const query = db('categories').where({ ownerId: filters.ownerId });
    if (filters.barbershopId) {
      query.where({ barbershopId: filters.barbershopId });
    }
    return query;
  },

  async findById(id: string): Promise<Category | undefined> {
    return db('categories').where({ id }).first();
  },

  async create(data: { name: string; photo?: string; barbershopId?: string | null; ownerId?: string | null }): Promise<Category> {
    const [category] = await db('categories').insert(data).returning('*');
    return category;
  },

  async update(id: string, data: Partial<{ name: string; photo: string; barbershopId: string | null; ownerId: string | null }>): Promise<Category> {
    const [category] = await db('categories').where({ id }).update({ ...data, updated_at: db.fn.now() }).returning('*');
    return category;
  },

  async delete(id: string): Promise<void> {
    await db('categories').where({ id }).delete();
  },

  async getSubcategories(categoryId: string): Promise<Category[]> {
    return db('categories')
      .join('subcategories', 'categories.id', 'subcategories.subcategoryId')
      .where('subcategories.categoryId', categoryId)
      .select('categories.*');
  },

  async addSubcategory(categoryId: string, subcategoryId: string): Promise<void> {
    await db('subcategories').insert({ categoryId, subcategoryId });
  },

  async removeSubcategory(categoryId: string, subcategoryId: string): Promise<void> {
    await db('subcategories').where({ categoryId, subcategoryId }).delete();
  },
};
