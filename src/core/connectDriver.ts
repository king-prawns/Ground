import {Driver} from '@king-prawns/pine-roots';

const connectDriver = (player: any, driver: Driver): void => {
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
};

export default connectDriver;
