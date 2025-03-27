import { updateIncident } from '../updateIncident';
import { updateProperty } from '../updateProperty';

// Mock updateProperty from updateProperty module
jest.mock('../updateProperty', () => ({
  updateProperty: jest.fn()
}));

describe('updateIncident', () => {
  it('should update the incident using updateProperty and return the updated incident', () => {
    // Arrange
    const incidentInput = { id: '1', status: 'open' };
    const fieldId = 'status';
    const newValue = 'closed';
    const expectedResult = { id: '1', status: 'closed' };

    // Set the mock implementation to return our expectedResult
    (updateProperty as jest.Mock).mockReturnValue(expectedResult);

    // Act
    const result = updateIncident(incidentInput, fieldId, newValue);

    // Assert
    expect(updateProperty).toHaveBeenCalledWith(incidentInput, fieldId, newValue);
    expect(result).toEqual(expectedResult);
  });
});
