import { updateProperty } from '../updateProperty';
import { FieldValueType } from '../../types';

describe('updateProperty', () => {
  test('should update a simple property', () => {
    const initialObj = { name: 'Alice', age: '25' };
    const newAge: FieldValueType = '30';
    const updatedObj = updateProperty(initialObj, 'age', newAge);

    expect(updatedObj).toEqual({ name: 'Alice', age: '30' });
  });

  test('should update a nested property', () => {
    const initialObj = {
      user: {
        address: {
          city: 'Oldtown',
          postcode: '12345'
        }
      }
    };
    const newCity: FieldValueType = 'Newtown';
    const updatedObj = updateProperty(initialObj, 'user.address.city', newCity);

    expect(updatedObj).toEqual({
      user: {
        address: {
          city: 'Newtown',
          postcode: '12345'
        }
      }
    });
  });
});
