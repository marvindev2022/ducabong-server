import { MissingParamError } from '@app/errors/MissingParamError';
import { HttpRequest } from '@app/protocols/http';
import Product from './product';

describe('Product', () => {
  const makeSut = (props: HttpRequest) => {
    const newProduct = new Product(props.body);

    return newProduct;
  };

  it('should throw missing error param if none name is provided', () => {
    const httpRequest = {
      body: {
        price: 10,
        description: 'any_description',
        image: 'any_image',
        quantity: 10,
      },
    };

    expect(() => makeSut(httpRequest)).toThrow(new MissingParamError('name'));
  });

  it('should throw missing error param if none price is provided', () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        description: 'any_description',
        image: 'any_image',
        quantity: 10,
      },
    };

    expect(() => makeSut(httpRequest)).toThrow(new MissingParamError('price'));
  });

  it('should throw missing error param if none description is provided', () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        price: 10,
        image: 'any_image',
        quantity: 10,
      },
    };

    expect(() => makeSut(httpRequest)).toThrow(
      new MissingParamError('description'),
    );
  });

  it('should throw missing error param if none image is provided', () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        price: 10,
        description: 'any_description',
        quantity: 10,
      },
    };

    expect(() => makeSut(httpRequest)).toThrow(new MissingParamError('image'));
  });

  it('should throw missing error param if none quantity is provided', () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        price: 10,
        description: 'any_description',
        image: 'any_image',
      },
    };

    expect(() => makeSut(httpRequest)).toThrow(
      new MissingParamError('quantity'),
    );
  });
});
