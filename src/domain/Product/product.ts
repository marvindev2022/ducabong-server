import { InvalidParamError } from '@app/errors/InvalidParamError';
import { MissingParamError } from '@app/errors/MissingParamError';
import { z } from 'zod';

interface ProductCreationProps {
  name: string;
  price: number;
  description: string;
  image: string;
  quantity: number;
}

interface ProductProps extends ProductCreationProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NewProduct {
  body: ProductCreationProps;
  statusCode: number;
}

interface IsValidMethodReturn {
  isValid: boolean;
  body: any;
  statusCode: number;
}

export class Product {
  props: ProductProps;

  constructor(props: ProductProps) {
    const { ...productProps } = props;

    const newProduct = this.handle(productProps);

    if (newProduct.statusCode >= 300) {
      throw newProduct.body;
    }
    this.props = {
      ...newProduct.body,
    };
  }

  private handle(props: ProductCreationProps): NewProduct {
    const { isValid, body, statusCode } = this.isValid(props);

    if (!isValid) {
      return {
        body: body,
        statusCode: statusCode,
      };
    }

    return {
      body: props,
      statusCode: 200,
    };
  }

  private isValid(params: ProductCreationProps): IsValidMethodReturn {
    const productSchema = z.object({
      name: z.string().min(3).max(255),
      price: z.number().min(0),
      description: z.string().min(3).max(255),
      image: z.string().min(3).max(255),
      quantity: z.number().min(0),
    });
    try {
      const productIsValid = productSchema.safeParse(params);
      if (!productIsValid.success) {
        const errorPath = productIsValid.error.issues[0].path[0].toString();
        const errorMessage = productIsValid.error.issues[0].message;
        const errorBody =
          errorMessage === 'Invalid'
            ? new InvalidParamError(errorPath)
            : new MissingParamError(errorPath);

        return {
          isValid: false,
          body: errorBody,
          statusCode: 400,
        };
      }
      return {
        isValid: true,
        body: null,
        statusCode: 200,
      };
    } catch (err) {
      return {
        isValid: false,
        body: err,
        statusCode: 400,
      };
    }
  }
}
export default Product;
