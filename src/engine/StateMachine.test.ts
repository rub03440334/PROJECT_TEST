import { StateMachine } from './StateMachine';

describe('StateMachine', () => {
  it('should initialize with the provided initial state', () => {
    const stateMachine = new StateMachine('BOOT');
    expect(stateMachine.getState()).toBe('BOOT');
  });

  it('should register states', () => {
    const stateMachine = new StateMachine('BOOT');
    stateMachine.registerState('RUNNING');
    expect(stateMachine.getState()).toBe('BOOT');
  });

  it('should change state when changeState is called with a registered state', () => {
    const stateMachine = new StateMachine('BOOT');
    stateMachine.registerState('RUNNING');

    stateMachine.changeState('RUNNING');
    expect(stateMachine.getState()).toBe('RUNNING');
  });

  it('should call onExit hook when leaving a state', () => {
    const onExitMock = jest.fn();
    const stateMachine = new StateMachine('BOOT');
    stateMachine.registerState('BOOT', { onExit: onExitMock });
    stateMachine.registerState('RUNNING');

    stateMachine.changeState('RUNNING');
    expect(onExitMock).toHaveBeenCalled();
  });

  it('should call onEnter hook when entering a state', () => {
    const onEnterMock = jest.fn();
    const stateMachine = new StateMachine('BOOT');
    stateMachine.registerState('RUNNING', { onEnter: onEnterMock });

    stateMachine.changeState('RUNNING');
    expect(onEnterMock).toHaveBeenCalled();
  });

  it('should not change state if the new state is not registered', () => {
    const stateMachine = new StateMachine('BOOT');
    stateMachine.changeState('UNKNOWN');
    expect(stateMachine.getState()).toBe('BOOT');
  });

  it('should not change state if the new state is the same as current state', () => {
    const onExitMock = jest.fn();
    const onEnterMock = jest.fn();
    const stateMachine = new StateMachine('BOOT');
    stateMachine.registerState('BOOT', { onExit: onExitMock, onEnter: onEnterMock });

    stateMachine.changeState('BOOT');
    expect(onExitMock).not.toHaveBeenCalled();
    expect(onEnterMock).not.toHaveBeenCalled();
  });

  it('should notify state change listeners', () => {
    const listenerMock = jest.fn();
    const stateMachine = new StateMachine('BOOT');
    stateMachine.registerState('RUNNING');

    stateMachine.addStateChangeListener(listenerMock);
    stateMachine.changeState('RUNNING');

    expect(listenerMock).toHaveBeenCalledWith('BOOT', 'RUNNING');
  });

  it('should remove state change listeners', () => {
    const listenerMock = jest.fn();
    const stateMachine = new StateMachine('BOOT');
    stateMachine.registerState('RUNNING');
    stateMachine.registerState('GAME_OVER');

    stateMachine.addStateChangeListener(listenerMock);
    stateMachine.changeState('RUNNING');
    expect(listenerMock).toHaveBeenCalledTimes(1);

    stateMachine.removeStateChangeListener(listenerMock);
    stateMachine.changeState('GAME_OVER');
    expect(listenerMock).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple state transitions', () => {
    const stateMachine = new StateMachine('BOOT');
    stateMachine.registerState('RUNNING');
    stateMachine.registerState('GAME_OVER');

    stateMachine.changeState('RUNNING');
    expect(stateMachine.getState()).toBe('RUNNING');

    stateMachine.changeState('GAME_OVER');
    expect(stateMachine.getState()).toBe('GAME_OVER');

    stateMachine.changeState('BOOT');
    expect(stateMachine.getState()).toBe('BOOT');
  });
});
