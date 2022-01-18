import {
  EAssertionType,
  EMatcher,
  EPlayerState,
  ITestScenario
} from '@king-prawns/pine-runner';

const optimalNetworkConditions: ITestScenario = {
  describe: 'Optimal network conditions',
  durationMs: 15000,
  filters: [],
  testCases: [
    {
      it: 'should goes from LOADING to PLAYING',
      assertions: [
        {
          type: EAssertionType.PLAYER_STATE,
          fromMs: 0,
          toMs: 5000,
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
          toMs: 15000,
          matcher: EMatcher.EQUAL,
          expected: [EPlayerState.PLAYING]
        },
        {
          type: EAssertionType.VARIANT,
          fromMs: 4000,
          toMs: 15000,
          matcher: EMatcher.GREATER_THAN,
          expected: 2
        },
        {
          type: EAssertionType.VARIANT,
          fromMs: 4000,
          toMs: 15000,
          matcher: EMatcher.LESS_THAN,
          expected: 3
        }
      ]
    }
  ]
};

export default optimalNetworkConditions;
