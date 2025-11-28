import { InputManager } from './InputManager.js';
import { PlayerController } from './PlayerController.js';
import { DebugOverlay } from './DebugOverlay.js';

/**
 * Main application entry point
 */
class Game {
  constructor() {
    this.inputManager = null;
    this.playerController = null;
    this.debugOverlay = null;
    
    this.init();
  }
  
  init() {
    console.log('Initializing Input Manager Demo...');
    
    // Initialize input manager
    this.inputManager = new InputManager();
    console.log('InputManager initialized');
    
    // Initialize player controller
    this.playerController = new PlayerController(this.inputManager);
    console.log('PlayerController initialized');
    
    // Initialize debug overlay
    this.debugOverlay = new DebugOverlay(this.inputManager);
    console.log('DebugOverlay initialized');
    
    // Set up testing helpers
    this.setupTestingHelpers();
    
    console.log('Game initialization complete!');
    console.log('Try using A/D keys, Arrow keys, or touch/mouse on the screen');
  }
  
  /**
   * Set up testing helpers for manual verification
   */
  setupTestingHelpers() {
    // Add keyboard test instructions to console
    console.log('=== Testing Instructions ===');
    console.log('1. Keyboard: Press A or Left Arrow for left movement');
    console.log('2. Keyboard: Press D or Right Arrow for right movement');
    console.log('3. Simultaneous: Hold both A and D (or both arrows) - should cancel movement');
    console.log('4. Touch: Click/touch left half of screen for left movement');
    console.log('5. Touch: Click/touch right half of screen for right movement');
    console.log('6. Swipe: Swipe left or right for movement with dead-zone filtering');
    console.log('============================');
    
    // Add visual feedback for touch zones (for testing)
    const leftZone = document.getElementById('touch-left');
    const rightZone = document.getElementById('touch-right');
    
    if (leftZone && rightZone) {
      leftZone.style.background = 'rgba(255, 0, 0, 0.1)';
      rightZone.style.background = 'rgba(0, 255, 0, 0.1)';
      
      console.log('Touch zones visualized: Red (left), Green (right)');
    }
  }
  
  /**
   * Clean up resources
   */
  destroy() {
    if (this.inputManager) {
      this.inputManager.destroy();
    }
  }
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (window.game) {
    window.game.destroy();
  }
});