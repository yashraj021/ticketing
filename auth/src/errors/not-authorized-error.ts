import { CustomError } from './custom-errors';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Authorized');

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors = () => {
    return [{ message: 'Not Authorized' }];
  };
}
