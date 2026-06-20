import db from '../../config/database';

export interface Category {
  id: string;
  name: string;
  photo: string | null;
  created_at: Date;
  updated_at: Date;
}

export const categoriesRepository = {
  async findAll(): Promise<Category[]> {
    return db('categories');
  },

  async findById(id: string): Promise<Category | undefined> {
    return db('categories').where({ id }).first();
  },

  async create(data: { name: string; photo?: string }): Promise<Category> {
    const [category] = await db('categories').insert(data).returning('*');
    return category;
  },

  async update(id: string, data: Partial<{ name: string; photo: string }>): Promise<Category> {
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
