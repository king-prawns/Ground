import {
  EAssertionType,
  EFilter,
  EMatcher,
  EPlayerState,
  ITestScenario
} from '@king-prawns/pine-runner';

const badNetworkConditions: ITestScenario = {
  describe: 'Bad network conditions',
  durationMs: 15000,
  filters: [
    {
      type: EFilter.THROTTLE,
      bandwidthKbps: 2048,
      fromMs: 0,
      toMs: 15000
    },
    {
      type: EFilter.LATENCY,
      delayMs: 500,
      fromMs: 0,
      toMs: 15000
    },
    {
      type: EFilter.OFFLINE,
      fromMs: 7000,
      toMs: 8500
    }
  ],
  testCases: [
    {
      it: 'should goes from LOADING to PLAYING',
      assertions: [
        {
          type: EAssertionType.PLAYER_STATE,
          fromMs: 0,
          toMs: 8000,
          matcher: EMatcher.EQUAL,
          expected: [
            EPlayerState.LOADING,
            EPlayerState.BUFFERING,
            EPlayerState.PLAYING
          ]
        },
        {
          type: EAssertionType.VARIANT,
          fromMs: 0,
          toMs: 3000,
          matcher: EMatcher.GREATER_THAN,
          expected: 2
        },
        {
          type: EAssertionType.VARIANT,
          fromMs: 0,
          toMs: 3000,
          matcher: EMatcher.LESS_THAN,
          expected: 3
        }
      ]
    },
    {
      it: 'should continue PLAYING without BUFFERING',
      assertions: [
        {
          type: EAssertionType.PLAYER_STATE,
          fromMs: 8000,
          toMs: 15000,
          matcher: EMatcher.EQUAL,
          expected: [EPlayerState.PLAYING]
        },
        {
          type: EAssertionType.VARIANT,
          fromMs: 3000,
          toMs: 15000,
          matcher: EMatcher.GREATER_THAN,
          expected: 1.5
        },
        {
          type: EAssertionType.VARIANT,
          fromMs: 3000,
          toMs: 15000,
          matcher: EMatcher.LESS_THAN,
          expected: 3
        }
      ]
    }
  ]
};

export default badNetworkConditions;
