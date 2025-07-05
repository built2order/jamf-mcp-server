import { JamfApiClient } from '../jamf-client.js';

describe('JamfApiClient', () => {
  let client: JamfApiClient;

  beforeEach(() => {
    client = new JamfApiClient({
      baseUrl: 'https://test.jamfcloud.com',
      clientId: 'fake-id',
      clientSecret: 'fake-secret',
      readOnlyMode: true,
    });
  });

  describe('Read-only mode', () => {
    it('should throw error when executing policy in read-only mode', async () => {
      await expect(client.executePolicy('123', ['device1'])).rejects.toThrow(
        'Cannot execute policies in read-only mode'
      );
    });

    it('should throw error when deploying script in read-only mode', async () => {
      await expect(client.deployScript('123', ['device1'])).rejects.toThrow(
        'Cannot deploy scripts in read-only mode'
      );
    });

    it('should throw error when updating inventory in read-only mode', async () => {
      await expect(client.updateInventory('device1')).rejects.toThrow(
        'Cannot update inventory in read-only mode'
      );
    });
  });

  describe('getNotifications', () => {
    it('should fetch notifications from the /v1/notifications endpoint', async () => {
      // Mock axios
      const mockData = { notifications: [{ id: 1, message: 'Test notification' }] };
      const client = new JamfApiClient({
        baseUrl: 'https://test.jamfcloud.com',
        clientId: 'fake-id',
        clientSecret: 'fake-secret',
        readOnlyMode: true,
      });
      // @ts-ignore
      client.axios = { get: jest.fn().mockResolvedValue({ data: mockData }) };
      const result = await client.getNotifications();
      expect(result).toEqual(mockData);
      // @ts-ignore
      expect(client.axios.get).toHaveBeenCalledWith('/api/v1/notifications');
    });
  });
});