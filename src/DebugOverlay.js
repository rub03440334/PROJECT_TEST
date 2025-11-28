/**
 * DebugOverlay - Visualizes input state for testing
 */
export class DebugOverlay {
  constructor(inputManager) {
    this.inputManager = inputManager;
    
    this.elements = {
      leftIntent: document.getElementById('left-intent'),
      rightIntent: document.getElementById('right-intent'),
      inputType: document.getElementById('input-type')
    };
    
    this.init();
  }
  
  init() {
    // Subscribe to input state changes
    this.inputManager.subscribe((state) => {
      this.updateDisplay(state);
    });
  }
  
  /**
   * Update debug display with current input state
   */
  updateDisplay(state) {
    // Update left intent
    if (this.elements.leftIntent) {
      this.elements.leftIntent.textContent = state.leftIntent ? 'ON' : 'OFF';
      this.elements.leftIntent.className = state.leftIntent ? 'debug-item active' : 'debug-item inactive';
    }
    
    // Update right intent
    if (this.elements.rightIntent) {
      this.elements.rightIntent.textContent = state.rightIntent ? 'ON' : 'OFF';
      this.elements.rightIntent.className = state.rightIntent ? 'debug-item active' : 'debug-item inactive';
    }
    
    // Update input type
    if (this.elements.inputType) {
      this.elements.inputType.textContent = state.inputType.charAt(0).toUpperCase() + state.inputType.slice(1);
    }
    
    // Log to console for debugging
    console.log('Input State:', {
      leftIntent: state.leftIntent,
      rightIntent: state.rightIntent,
      inputType: state.inputType,
      timestamp: new Date().toISOString()
    });
  }
}