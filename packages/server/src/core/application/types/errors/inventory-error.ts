import { ApplicationError } from './application-error';

export class InventoryNotFoundError extends ApplicationError {
  constructor(details: { message: string }) {
    super(details.message, 'INVENTORY_NOT_FOUND', details);
  }
}

export class InventoryCreationError extends ApplicationError {
  constructor(details: { message: string }) {
    super(details.message, 'INVENTORY_CREATION_FAILED', details);
  }
}

export class InventoryOwnershipError extends ApplicationError {
  constructor(details: { message: string }) {
    super(details.message, 'INVENTORY_OWNERSHIP_ERROR', details);
  }
}
