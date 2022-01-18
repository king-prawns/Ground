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
      toMs: 7000
    },
    {
      type: EFilter.OFFLINE,
      fromMs: 7000,
      toMs: 8500
    },
    {
      type: EFilter.JITTER,
      delayMs: 400,
      jitterMs: 300,
      fromMs: 8500,
      toMs: 15000
    }
  ],
  testCases: [
    {
      it: 'should goes from LOADING to PLAYING',
      assertions: [
        {
          type: EAssertionType.PLAYER_STATE,
          fromMs: 0,
          toMs: 3000,
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
      it: 'should continue PLAYING at the same variant',
      assertions: [
        {
          type: EAssertionType.PLAYER_STATE,
          fromMs: 4000,
          toMs: 10000,
          matcher: EMatcher.ENDS_WITH,
          expected: EPlayerState.PLAYING
        },
        {
          type: EAssertionType.VARIANT,
          fromMs: 4000,
          toMs: 10000,
          matcher: EMatcher.GREATER_THAN,
          expected: 2
        },
        {
          type: EAssertionType.VARIANT,
          fromMs: 4000,
          toMs: 10000,
          matcher: EMatcher.LESS_THAN,
          expected: 3
        }
      ]
    }
  ]
};

export default badNetworkConditions;
