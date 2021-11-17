const replaceManifestUrl = (url: string): string => {
  const proxy = process.env.PROXY_URL || 'http://localhost';

  return `${proxy}:5000/pine/placeholder.mpd?url=${encodeURIComponent(
    url
  )}&proxy=${encodeURIComponent(proxy)}`;
};

export default replaceManifestUrl;
