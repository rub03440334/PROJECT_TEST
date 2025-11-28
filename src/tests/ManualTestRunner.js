/**
 * Manual test runner for InputManager
 * This file can be used to manually verify functionality
 */
import { InputManager } from '../InputManager.js';

/**
 * Manual test suite for InputManager
 */
class ManualTestRunner {
  constructor() {
    this.inputManager = new InputManager();
    this.testResults = [];
  }
  
  /**
   * Run all manual tests
   */
  async runTests() {
    console.log('=== Starting Manual InputManager Tests ===');
    
    await this.testInitialState();
    await this.testKeyboardInput();
    await this.testSimultaneousKeys();
    await this.testTouchInput();
    await this.testStateSubscription();
    
    this.printResults();
  }
  
  /**
   * Test initial state
   */
  async testInitialState() {
    console.log('\n--- Testing Initial State ---');
    
    const state = this.inputManager.getState();
    
    this.assert(state.leftIntent === false, 'Initial leftIntent should be false');
    this.assert(state.rightIntent === false, 'Initial rightIntent should be false');
    this.assert(state.inputType === 'none', 'Initial inputType should be none');
    
    console.log('✓ Initial state test passed');
  }
  
  /**
   * Test keyboard input
   */
  async testKeyboardInput() {
    console.log('\n--- Testing Keyboard Input ---');
    
    // Test A key
    this.simulateKeyPress('a');
    await this.wait(50);
    let state = this.inputManager.getState();
    this.assert(state.leftIntent === true, 'A key should trigger leftIntent');
    this.assert(state.inputType === 'keyboard', 'Input type should be keyboard');
    
    this.simulateKeyRelease('a');
    await this.wait(50);
    state = this.inputManager.getState();
    this.assert(state.leftIntent === false, 'Releasing A key should clear leftIntent');
    
    // Test D key
    this.simulateKeyPress('d');
    await this.wait(50);
    state = this.inputManager.getState();
    this.assert(state.rightIntent === true, 'D key should trigger rightIntent');
    
    this.simulateKeyRelease('d');
    await this.wait(50);
    state = this.inputManager.getState();
    this.assert(state.rightIntent === false, 'Releasing D key should clear rightIntent');
    
    console.log('✓ Keyboard input test passed');
  }
  
  /**
   * Test simultaneous key presses
   */
  async testSimultaneousKeys() {
    console.log('\n--- Testing Simultaneous Key Presses ---');
    
    // Press both A and D
    this.simulateKeyPress('a');
    this.simulateKeyPress('d');
    await this.wait(50);
    
    const state = this.inputManager.getState();
    this.assert(state.leftIntent === true, 'A key should still be active');
    this.assert(state.rightIntent === true, 'D key should also be active');
    
    // Release both
    this.simulateKeyRelease('a');
    this.simulateKeyRelease('d');
    await this.wait(50);
    
    const finalState = this.inputManager.getState();
    this.assert(finalState.leftIntent === false, 'Both intents should be cleared');
    this.assert(finalState.rightIntent === false, 'Both intents should be cleared');
    
    console.log('✓ Simultaneous keys test passed');
  }
  
  /**
   * Test touch input
   */
  async testTouchInput() {
    console.log('\n--- Testing Touch Input ---');
    
    // Mock getBoundingClientRect
    Object.defineProperty(document.documentElement, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 800 })
    });
    
    // Test left zone touch
    this.simulateTouchStart(100, 200); // Left side
    await this.wait(50);
    
    let state = this.inputManager.getState();
    this.assert(state.leftIntent === true, 'Left zone touch should trigger leftIntent');
    this.assert(state.inputType === 'touch', 'Input type should be touch');
    
    this.simulateTouchEnd(0);
    await this.wait(50);
    
    // Test right zone touch
    this.simulateTouchStart(700, 200); // Right side
    await this.wait(50);
    
    state = this.inputManager.getState();
    this.assert(state.rightIntent === true, 'Right zone touch should trigger rightIntent');
    
    this.simulateTouchEnd(0);
    await this.wait(50);
    
    console.log('✓ Touch input test passed');
  }
  
  /**
   * Test state subscription
   */
  async testStateSubscription() {
    console.log('\n--- Testing State Subscription ---');
    
    let callbackCount = 0;
    let lastState = null;
    
    const callback = (state) => {
      callbackCount++;
      lastState = state;
    };
    
    const unsubscribe = this.inputManager.subscribe(callback);
    
    // Should be called immediately with current state
    this.assert(callbackCount === 1, 'Callback should be called immediately on subscribe');
    
    // Trigger state change
    this.simulateKeyPress('a');
    await this.wait(50);
    
    this.assert(callbackCount > 1, 'Callback should be called on state change');
    this.assert(lastState.leftIntent === true, 'Callback should receive updated state');
    
    unsubscribe();
    
    console.log('✓ State subscription test passed');
  }
  
  /**
   * Helper method to simulate key press
   */
  simulateKeyPress(key) {
    const event = new KeyboardEvent('keydown', { key });
    document.dispatchEvent(event);
  }
  
  /**
   * Helper method to simulate key release
   */
  simulateKeyRelease(key) {
    const event = new KeyboardEvent('keyup', { key });
    document.dispatchEvent(event);
  }
  
  /**
   * Helper method to simulate touch start
   */
  simulateTouchStart(x, y) {
    const event = new TouchEvent('touchstart', {
      changedTouches: [{
        identifier: 0,
        clientX: x,
        clientY: y
      }]
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Helper method to simulate touch end
   */
  simulateTouchEnd(identifier) {
    const event = new TouchEvent('touchend', {
      changedTouches: [{
        identifier: identifier,
        clientX: 0,
        clientY: 0
      }]
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Helper method to wait
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Assertion helper
   */
  assert(condition, message) {
    if (condition) {
      this.testResults.push({ passed: true, message });
    } else {
      this.testResults.push({ passed: false, message });
      console.error(`✗ Assertion failed: ${message}`);
    }
  }
  
  /**
   * Print test results
   */
  printResults() {
    console.log('\n=== Test Results ===');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    
    console.log(`Passed: ${passed}/${total}`);
    
    if (passed === total) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('❌ Some tests failed');
      this.testResults.filter(r => !r.passed).forEach(r => {
        console.log(`  - ${r.message}`);
      });
    }
  }
  
  /**
   * Clean up
   */
  destroy() {
    if (this.inputManager) {
      this.inputManager.destroy();
    }
  }
}

// Export for use in browser console
window.ManualTestRunner = ManualTestRunner;

// Auto-run if in test environment
if (typeof window !== 'undefined') {
  console.log('ManualTestRunner available. Run: const runner = new ManualTestRunner(); runner.runTests();');
}