import { UserRepository } from '../repositories/user.repository.js';
import { User, userRoles } from '../models/User.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

const userRepository = new UserRepository();

export const getAll = async (): Promise<User[]> => {
  return userRepository.findAll();
};

export const getById = async (id: string): Promise<User> => {
  if (!id) {
    throw new ValidationError('User id is required');
  }

  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError('User', id);
  }

  return user;
};

export const updateRole = async (id: string, role: string): Promise<User> => {
  if (!id) {
    throw new ValidationError('User id is required');
  }

  if (!userRoles.includes(role as any)) {
    throw new ValidationError('Invalid role');
  }

  const updated = await userRepository.updateRole(id, { role: role as any });
  if (!updated) {
    throw new NotFoundError('User', id);
  }

  return updated;
};

export const remove = async (id: string): Promise<void> => {
  if (!id) {
    throw new ValidationError('User id is required');
  }

  const deleted = await userRepository.delete(id);
  if (!deleted) {
    throw new NotFoundError('User', id);
  }
};
