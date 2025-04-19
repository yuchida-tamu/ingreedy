import { ApplicationError } from './application-error';

export class InventoryNotFoundError extends ApplicationError {
  constructor(details: { message: string }) {
    super(details.message, 'INVENTORY_NOT_FOUND', details);
  }
}
