import settingsReducer from '../../../src/reducers/settingsReducer';
import { setDefaultScanLanguage } from '../../../src/actions/settingsActions';

describe('Redux: Settings Reducer', () => {
  it('should return the initial state', () => {
    const mockRepsonse = { scanLanguage: 'EN' };
    expect(settingsReducer(undefined, {})).toEqual(mockRepsonse);
  });

  it('should handle SET_DEFAULT_SCAN_LANGUAGE', () => {
    const mockRepsonse = { scanLanguage: 'DE' };

    expect(settingsReducer({}, setDefaultScanLanguage('DE'))).toEqual(mockRepsonse);
  });
});
