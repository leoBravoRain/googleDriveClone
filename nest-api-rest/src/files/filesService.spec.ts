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

  it('should return empty array when API call is successful and return empty array', async () => {
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

  it('should return files when API call is successful and return non empty array', async () => {
    const expectedFiles = [
      {
        _id: 'test-id-1',
        file_id: 'test-file-id-1',
        filename: 'test-file-1.txt',
        original_name: 'test-file-1.txt',
        size: 1024,
        file_type: 'text/plain',
        upload_date: '2024-01-01T10:00:00Z',
        storage_path: '/files/test-file-1.txt',
        user_id: 'user-1',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
      },
      {
        _id: 'test-id-2',
        file_id: 'test-file-id-2',
        filename: 'test-file-2.pdf',
        original_name: 'test-file-2.pdf',
        size: 2048,
        file_type: 'application/pdf',
        upload_date: '2024-01-01T11:00:00Z',
        storage_path: '/files/test-file-2.pdf',
        user_id: 'user-1',
        created_at: '2024-01-01T11:00:00Z',
        updated_at: '2024-01-01T11:00:00Z',
      },
      {
        _id: 'test-id-3',
        file_id: 'test-file-id-3',
        filename: 'test-file-3.jpg',
        original_name: 'test-file-3.jpg',
        size: 3072,
        file_type: 'image/jpeg',
        upload_date: '2024-01-01T12:00:00Z',
        storage_path: '/files/test-file-3.jpg',
        user_id: 'user-1',
        created_at: '2024-01-01T12:00:00Z',
        updated_at: '2024-01-01T12:00:00Z',
      },
    ];

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
    expect(result).toHaveLength(3);
    expect(mockFetch).toHaveBeenCalledWith(process.env.API_FILES_URL);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // result structure
    expect(result[0]).toEqual(expectedFiles[0]);
    expect(result[1]).toEqual(expectedFiles[1]);
    expect(result[2]).toEqual(expectedFiles[2]);
  });

  it('should throw an error when API call is not successful', async () => {
    // Arrange
    mockFetch.mockRejectedValue(new Error('API call failed'));

    // Act & Assert
    await expect(filesService.findAll()).rejects.toThrow('API call failed');
  });
});
