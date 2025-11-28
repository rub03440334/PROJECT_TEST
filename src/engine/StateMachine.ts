export type StateChangeListener = (
  previousState: string,
  newState: string
) => void;

export interface StateHooks {
  onEnter?: () => void;
  onExit?: () => void;
}

export class StateMachine {
  private currentState: string;
  private states: Map<string, StateHooks>;
  private listeners: StateChangeListener[];

  constructor(initialState: string) {
    this.currentState = initialState;
    this.states = new Map();
    this.listeners = [];
    this.registerState(initialState);
  }

  public registerState(state: string, hooks?: StateHooks): void {
    this.states.set(state, hooks || {});
  }

  public getState(): string {
    return this.currentState;
  }

  public changeState(newState: string): void {
    if (!this.states.has(newState)) {
      console.warn(`State "${newState}" not registered`);
      return;
    }

    if (this.currentState === newState) {
      return;
    }

    const previousState = this.currentState;
    const currentHooks = this.states.get(previousState);
    if (currentHooks?.onExit) {
      currentHooks.onExit();
    }

    this.currentState = newState;
    const newHooks = this.states.get(newState);
    if (newHooks?.onEnter) {
      newHooks.onEnter();
    }

    this.notifyListeners(previousState, newState);
  }

  public addStateChangeListener(listener: StateChangeListener): void {
    this.listeners.push(listener);
  }

  public removeStateChangeListener(listener: StateChangeListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners(previousState: string, newState: string): void {
    this.listeners.forEach((listener) => {
      listener(previousState, newState);
    });
  }
}
