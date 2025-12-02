import { RatingService } from './rating.service';

describe('RatingService', () => {
  let service: RatingService;

  beforeEach(() => {
    service = new RatingService();
  });

  it('should start with empty ratings', () => {
    expect(service.ratings()).toEqual([]);
  });

  it('should set a rating for a quote id', () => {
    service.updateRating({ id: 1, rating: 4 });

    expect(service.ratings()).toEqual({
      1: 4,
    });
  });

  it('should update rating for existing id', () => {
    service.updateRating({ id: 1, rating: 3 });
    service.updateRating({ id: 1, rating: 5 });

    expect(service.ratings()).toEqual({
      1: 5,
    });
  });

  it('should allow multiple ratings for different ids', () => {
    service.updateRating({ id: 1, rating: 4 });
    service.updateRating({ id: 2, rating: 2 });

    expect(service.ratings()).toEqual({
      1: 4,
      2: 2,
    });
  });
});
