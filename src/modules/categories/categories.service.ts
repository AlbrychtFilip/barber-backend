import { categoriesRepository, CategoryFilters } from './categories.repository';

export const categoriesService = {
  async getAll(filters: CategoryFilters) {
    return categoriesRepository.findAll(filters);
  },

  async getById(id: string) {
    const category = await categoriesRepository.findById(id);
    if (!category) {
      throw { status: 404, message: 'Category not found' };
    }
    const subcategories = await categoriesRepository.getSubcategories(id);
    return { ...category, subcategories };
  },

  async create(data: { name: string; photo?: string; barbershopId?: string | null; ownerId?: string | null }) {
    return categoriesRepository.create(data);
  },

  async update(id: string, data: { name?: string; photo?: string; barbershopId?: string | null; ownerId?: string | null }) {
    const category = await categoriesRepository.findById(id);
    if (!category) {
      throw { status: 404, message: 'Category not found' };
    }
    return categoriesRepository.update(id, data);
  },

  async delete(id: string) {
    const category = await categoriesRepository.findById(id);
    if (!category) {
      throw { status: 404, message: 'Category not found' };
    }
    await categoriesRepository.delete(id);
  },

  async addSubcategory(categoryId: string, subcategoryId: string) {
    const parent = await categoriesRepository.findById(categoryId);
    if (!parent) {
      throw { status: 404, message: 'Parent category not found' };
    }
    const child = await categoriesRepository.findById(subcategoryId);
    if (!child) {
      throw { status: 404, message: 'Subcategory not found' };
    }
    if (categoryId === subcategoryId) {
      throw { status: 400, message: 'Category cannot be its own subcategory' };
    }
    await categoriesRepository.addSubcategory(categoryId, subcategoryId);
  },

  async removeSubcategory(categoryId: string, subcategoryId: string) {
    await categoriesRepository.removeSubcategory(categoryId, subcategoryId);
  },
};
