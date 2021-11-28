import {Driver} from '@king-prawns/pine-roots';

const connectDriver = (
  player: any,
  videoElement: HTMLVideoElement,
  driver: Driver
): void => {
  let isSeeking = false;

  player
    .getNetworkingEngine()
    .registerRequestFilter((_type: any, request: any) => {
      driver.onHttpRequest(request.uris[0]);
    });

  player
    .getNetworkingEngine()
    .registerResponseFilter((_type: any, response: any) => {
      driver.onHttpResponse({
        url: response.uri,
        timeMs: response.timeMs,
        byteLength: response.data.byteLength
      });
    });

  videoElement.addEventListener('playing', () => {
    driver.onPlaying();
  });
  videoElement.addEventListener('pause', () => {
    driver.onPaused();
  });
  videoElement.addEventListener('ended', () => {
    driver.onEnded();
  });
  videoElement.addEventListener('timeupdate', () => {
    if (isSeeking) {
      if (!videoElement.seeking) {
        isSeeking = false;
        driver.onSeekEnded();
      }
    }
    const currentTimeMs = Math.trunc(videoElement.currentTime * 1000);
    driver.onTimeUpdate(currentTimeMs);
  });
  videoElement.addEventListener('seeking', () => {
    isSeeking = true;
    driver.onSeekStarted();
  });

  // TODO:
  // manifest update
  // detect Buffering
  // from shaka with polling?
  // buffer audio video
  // active variant
  // estimated bandwidth
  // memory heap?
};

export default connectDriver;
