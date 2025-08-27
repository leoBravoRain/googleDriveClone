import { FilesService } from './files.service';

describe('FilesService', () => {
  let filesService: FilesService;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  // set env varaiblelet
  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    global.fetch = mockFetch;
    filesService = new FilesService();

    // set env varaible
    process.env.API_FILES_URL = 'http://localhost:8000/api/v1/files';
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.API_FILES_URL;
  });

  it('should return all files when API call is successful and return empty array', async () => {
    const expectedFiles = [];
    // Arrange
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        files: expectedFiles,
      }),
    } as unknown as Response);

    // Act
    const result = await filesService.findAll();

    // Assert
    expect(result).toBe(expectedFiles);
    expect(result).toEqual(expectedFiles);
    expect(result).toHaveLength(0);
    expect(mockFetch).toHaveBeenCalledWith(process.env.API_FILES_URL);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
