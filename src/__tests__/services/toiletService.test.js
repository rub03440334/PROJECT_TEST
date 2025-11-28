import { toiletService } from '../../services/toiletService';
import api from '../../config/api';

jest.mock('../../config/api');

describe('toiletService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all toilets', async () => {
    const mockToilets = [
      { id: 1, name: 'Toilet 1' },
      { id: 2, name: 'Toilet 2' },
    ];
    api.get.mockResolvedValue(mockToilets);

    const result = await toiletService.getAllToilets();

    expect(api.get).toHaveBeenCalledWith('/toilets');
    expect(result).toEqual(mockToilets);
  });

  it('should get toilets nearby', async () => {
    const mockToilets = [{ id: 1, name: 'Toilet 1' }];
    api.get.mockResolvedValue(mockToilets);

    const result = await toiletService.getToiletsNearby(51.5, -0.1, 5);

    expect(api.get).toHaveBeenCalledWith('/toilets/nearby', {
      params: {
        latitude: 51.5,
        longitude: -0.1,
        radiusKm: 5,
      },
    });
    expect(result).toEqual(mockToilets);
  });

  it('should get toilet details', async () => {
    const mockToilet = { id: 1, name: 'Toilet 1', address: '123 Main St' };
    api.get.mockResolvedValue(mockToilet);

    const result = await toiletService.getToiletDetails(1);

    expect(api.get).toHaveBeenCalledWith('/toilets/1');
    expect(result).toEqual(mockToilet);
  });

  it('should rate a toilet', async () => {
    const mockResponse = { success: true };
    api.post.mockResolvedValue(mockResponse);

    const result = await toiletService.rateToilet(1, 5);

    expect(api.post).toHaveBeenCalledWith('/toilets/1/rate', {
      rating: 5,
    });
    expect(result).toEqual(mockResponse);
  });

  it('should report an issue', async () => {
    const mockResponse = { success: true };
    api.post.mockResolvedValue(mockResponse);

    const result = await toiletService.reportIssue(1, 'not_clean');

    expect(api.post).toHaveBeenCalledWith('/toilets/1/report', {
      issue: 'not_clean',
      timestamp: expect.any(String),
    });
    expect(result).toEqual(mockResponse);
  });
});
