import replaceManifestUrl from './replaceManifestUrl';

describe('replaceManifestUrl', () => {
  it('should replace the manifest url using localhost as a proxy', () => {
    expect(replaceManifestUrl('http://example/manifest.mpd')).toBe(
      'http://localhost:5000/pine/placeholder.mpd?url=http%3A%2F%2Fexample%2Fmanifest.mpd&proxy=http%3A%2F%2Flocalhost'
    );
  });

  it('should replace the manifest url using process.env.PROXY_URL as a proxy', () => {
    process.env.PROXY_URL = 'http://myproxyip';
    expect(replaceManifestUrl('http://example/manifest.mpd')).toBe(
      'http://myproxyip:5000/pine/placeholder.mpd?url=http%3A%2F%2Fexample%2Fmanifest.mpd&proxy=http%3A%2F%2Fmyproxyip'
    );
    process.env.PROXY_URL = '';
  });
});
