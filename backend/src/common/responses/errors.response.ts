import { ValidationErrorItem } from '../interfaces/validation-error.interface';

export class ErrorsResponse {
  error: string;
  path: string;
  status: number;
  details: ValidationErrorItem[] = [];
}
