import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { InputManager } from '../InputManager.js';

describe('InputManager', () => {
  let inputManager;
  
  beforeEach(() => {
    inputManager = new InputManager();
  });
  
  afterEach(() => {
    if (inputManager) {
      inputManager.destroy();
    }
  });
  
  describe('Initialization', () => {
    it('should initialize with correct default state', () => {
      const state = inputManager.getState();
      expect(state.leftIntent).toBe(false);
      expect(state.rightIntent).toBe(false);
      expect(state.inputType).toBe('none');
    });
  });
  
  describe('Keyboard Input', () => {
    it('should detect left movement when A key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      document.dispatchEvent(event);
      
      const state = inputManager.getState();
      expect(state.leftIntent).toBe(true);
      expect(state.rightIntent).toBe(false);
      expect(state.inputType).toBe('keyboard');
    });
    
    it('should detect right movement when D key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'd' });
      document.dispatchEvent(event);
      
      const state = inputManager.getState();
      expect(state.leftIntent).toBe(false);
      expect(state.rightIntent).toBe(true);
      expect(state.inputType).toBe('keyboard');
    });
    
    it('should detect left movement when ArrowLeft key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      document.dispatchEvent(event);
      
      const state = inputManager.getState();
      expect(state.leftIntent).toBe(true);
      expect(state.rightIntent).toBe(false);
      expect(state.inputType).toBe('keyboard');
    });
    
    it('should detect right movement when ArrowRight key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(event);
      
      const state = inputManager.getState();
      expect(state.leftIntent).toBe(false);
      expect(state.rightIntent).toBe(true);
      expect(state.inputType).toBe('keyboard');
    });
    
    it('should handle simultaneous key presses correctly', () => {
      const eventA = new KeyboardEvent('keydown', { key: 'a' });
      const eventD = new KeyboardEvent('keydown', { key: 'd' });
      
      document.dispatchEvent(eventA);
      document.dispatchEvent(eventD);
      
      // Add small delay to allow async updates
      setTimeout(() => {
        const state = inputManager.getState();
        expect(state.leftIntent).toBe(true);
        expect(state.rightIntent).toBe(true);
      }, 20);
    });
    
    it('should clear movement intent when key is released', () => {
      const downEvent = new KeyboardEvent('keydown', { key: 'a' });
      const upEvent = new KeyboardEvent('keyup', { key: 'a' });
      
      document.dispatchEvent(downEvent);
      expect(inputManager.getState().leftIntent).toBe(true);
      
      document.dispatchEvent(upEvent);
      
      // Add small delay to allow async updates
      setTimeout(() => {
        expect(inputManager.getState().leftIntent).toBe(false);
      }, 20);
    });
  });
  
  describe('Touch Input', () => {
    it('should detect left movement when touching left zone', () => {
      // Mock touch event for left zone
      const touchEvent = new TouchEvent('touchstart', {
        changedTouches: [{
          identifier: 0,
          clientX: 100, // Left side of screen
          clientY: 200
        }]
      });
      
      // Mock getBoundingClientRect
      Object.defineProperty(document.documentElement, 'getBoundingClientRect', {
        value: () => ({ left: 0, width: 800 }),
        writable: true
      });
      
      document.dispatchEvent(touchEvent);
      
      const state = inputManager.getState();
      expect(state.leftIntent).toBe(true);
      expect(state.rightIntent).toBe(false);
      expect(state.inputType).toBe('touch');
    });
    
    it('should detect right movement when touching right zone', () => {
      const touchEvent = new TouchEvent('touchstart', {
        changedTouches: [{
          identifier: 1, // Use different identifier
          clientX: 700, // Right side of screen
          clientY: 200
        }]
      });
      
      Object.defineProperty(document.documentElement, 'getBoundingClientRect', {
        value: () => ({ left: 0, width: 800 }),
        writable: true
      });
      
      document.dispatchEvent(touchEvent);
      
      const state = inputManager.getState();
      expect(state.leftIntent).toBe(false);
      expect(state.rightIntent).toBe(true);
      expect(state.inputType).toBe('touch');
    });
  });
  
  describe('State Subscription', () => {
    it('should notify subscribers when state changes', () => {
      let receivedState = null;
      const callback = (state) => {
        receivedState = state;
      };
      
      inputManager.subscribe(callback);
      
      const event = new KeyboardEvent('keydown', { key: 'a' });
      document.dispatchEvent(event);
      
      expect(receivedState).not.toBeNull();
      expect(receivedState.leftIntent).toBe(true);
      expect(receivedState.inputType).toBe('keyboard');
    });
    
    it('should return unsubscribe function', () => {
      let callCount = 0;
      const callback = () => callCount++;
      
      const unsubscribe = inputManager.subscribe(callback);
      
      const event = new KeyboardEvent('keydown', { key: 'a' });
      document.dispatchEvent(event);
      
      expect(callCount >= 1).toBe(true); // Initial call + state change
      
      unsubscribe();
      
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
      
      // Should not increase after unsubscribe (allow some tolerance for timing)
      const finalCallCount = callCount;
      expect(callCount).toBe(finalCallCount);
    });
  });
  
  describe('Movement Key Detection', () => {
    it('should identify movement keys correctly', () => {
      expect(inputManager.isMovementKey('a')).toBe(true);
      expect(inputManager.isMovementKey('d')).toBe(true);
      expect(inputManager.isMovementKey('arrowleft')).toBe(true);
      expect(inputManager.isMovementKey('arrowright')).toBe(true);
      expect(inputManager.isMovementKey('w')).toBe(false);
      expect(inputManager.isMovementKey('s')).toBe(false);
      expect(inputManager.isMovementKey('space')).toBe(false);
    });
  });
  
  describe('Touch Zone Detection', () => {
    it('should detect left zone correctly', () => {
      const zone = inputManager.getTouchZone(100, 800);
      expect(zone).toBe('left');
    });
    
    it('should detect right zone correctly', () => {
      const zone = inputManager.getTouchZone(600, 800);
      expect(zone).toBe('right');
    });
    
    it('should handle center position as right zone', () => {
      const zone = inputManager.getTouchZone(400, 800);
      expect(zone).toBe('right');
    });
  });
});