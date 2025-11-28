/**
 * InputManager - Unified input handling for desktop and mobile
 * Maps raw input events to movement intents
 */
export class InputManager {
  constructor() {
    this.inputState = {
      leftIntent: false,
      rightIntent: false,
      inputType: 'none' // 'keyboard', 'touch', 'none'
    };
    
    this.keysPressed = new Set();
    this.touchZones = {
      left: null,
      right: null
    };
    
    this.deadZone = 10; // pixels for swipe dead zone
    this.swipeThreshold = 30; // minimum swipe distance
    this.touchStartPos = null;
    this.activeTouches = new Map();
    
    this.callbacks = new Set();
    this.debounceDelay = 16; // ~60fps
    this.lastUpdate = 0;
    
    this.init();
  }
  
  init() {
    this.setupKeyboardListeners();
    this.setupTouchListeners();
  }
  
  /**
   * Set up keyboard event listeners for desktop controls
   */
  setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }
  
  /**
   * Set up touch event listeners for mobile controls
   */
  setupTouchListeners() {
    // Prevent default touch behaviors like scrolling
    document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    
    // Mouse events for testing on desktop
    document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
  }
  
  /**
   * Handle keyboard key down events
   */
  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    
    // Only process movement keys
    if (this.isMovementKey(key)) {
      event.preventDefault();
      
      if (!this.keysPressed.has(key)) {
        this.keysPressed.add(key);
        this.inputState.inputType = 'keyboard';
        this.updateMovementIntents();
      }
    }
  }
  
  /**
   * Handle keyboard key up events
   */
  handleKeyUp(event) {
    const key = event.key.toLowerCase();
    
    if (this.isMovementKey(key)) {
      event.preventDefault();
      
      this.keysPressed.delete(key);
      this.updateMovementIntents();
    }
  }
  
  /**
   * Handle touch start events
   */
  handleTouchStart(event) {
    event.preventDefault();
    
    const now = Date.now();
    if (now - this.lastUpdate < this.debounceDelay) {
      return;
    }
    
    this.inputState.inputType = 'touch';
    
    for (const touch of event.changedTouches) {
      const rect = document.documentElement.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const zone = this.getTouchZone(x, rect.width);
      
      this.activeTouches.set(touch.identifier, {
        startX: x,
        startY: touch.clientY - rect.top,
        currentX: x,
        currentY: touch.clientY - rect.top,
        zone: zone
      });
    }
    
    this.updateMovementIntents();
  }
  
  /**
   * Handle touch move events
   */
  handleTouchMove(event) {
    event.preventDefault();
    
    const now = Date.now();
    if (now - this.lastUpdate < this.debounceDelay) {
      return;
    }
    
    for (const touch of event.changedTouches) {
      const touchData = this.activeTouches.get(touch.identifier);
      if (touchData) {
        const rect = document.documentElement.getBoundingClientRect();
        touchData.currentX = touch.clientX - rect.left;
        touchData.currentY = touch.clientY - rect.top;
      }
    }
    
    this.updateMovementIntents();
  }
  
  /**
   * Handle touch end events
   */
  handleTouchEnd(event) {
    event.preventDefault();
    
    for (const touch of event.changedTouches) {
      this.activeTouches.delete(touch.identifier);
    }
    
    this.updateMovementIntents();
  }
  
  /**
   * Handle mouse down events (for testing)
   */
  handleMouseDown(event) {
    const rect = document.documentElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const zone = this.getTouchZone(x, rect.width);
    
    this.activeTouches.set('mouse', {
      startX: x,
      startY: event.clientY - rect.top,
      currentX: x,
      currentY: event.clientY - rect.top,
      zone: zone
    });
    
    this.inputState.inputType = 'touch';
    this.updateMovementIntents();
  }
  
  /**
   * Handle mouse up events (for testing)
   */
  handleMouseUp(event) {
    this.activeTouches.delete('mouse');
    this.updateMovementIntents();
  }
  
  /**
   * Check if a key is a movement key
   */
  isMovementKey(key) {
    return ['a', 'd', 'arrowleft', 'arrowright'].includes(key);
  }
  
  /**
   * Determine which touch zone a touch is in
   */
  getTouchZone(x, width) {
    const midPoint = width / 2;
    return x < midPoint ? 'left' : 'right';
  }
  
  /**
   * Update movement intents based on current input state
   */
  updateMovementIntents() {
    const now = Date.now();
    if (now - this.lastUpdate < this.debounceDelay) {
      return;
    }
    
    // Reset intents
    let leftIntent = false;
    let rightIntent = false;
    
    // Check touch/swipe input first (has priority)
    if (this.activeTouches.size > 0) {
      for (const touchData of this.activeTouches.values()) {
        const deltaX = touchData.currentX - touchData.startX;
        
        // Check for swipe or sustained touch
        if (Math.abs(deltaX) > this.swipeThreshold) {
          // Swipe detected
          if (deltaX > 0) {
            rightIntent = true;
          } else {
            leftIntent = true;
          }
        } else if (Math.abs(deltaX) <= this.deadZone) {
          // Within dead zone, use touch zone
          if (touchData.zone === 'left') {
            leftIntent = true;
          } else {
            rightIntent = true;
          }
        }
      }
      
      this.inputState.inputType = 'touch';
    } else {
      // Check keyboard input only if no touch input
      if (this.keysPressed.has('a') || this.keysPressed.has('arrowleft')) {
        leftIntent = true;
        this.inputState.inputType = 'keyboard';
      }
      if (this.keysPressed.has('d') || this.keysPressed.has('arrowright')) {
        rightIntent = true;
        this.inputState.inputType = 'keyboard';
      }
      
      // Reset input type if no keys pressed
      if (this.keysPressed.size === 0) {
        this.inputState.inputType = 'none';
      }
    }
    
    // Update state if changed
    if (this.inputState.leftIntent !== leftIntent || 
        this.inputState.rightIntent !== rightIntent) {
      this.inputState.leftIntent = leftIntent;
      this.inputState.rightIntent = rightIntent;
      this.lastUpdate = now;
      
      // Notify callbacks
      this.notifyCallbacks();
    }
  }
  
  /**
   * Get current input state
   */
  getState() {
    return { ...this.inputState };
  }
  
  /**
   * Subscribe to input state changes
   */
  subscribe(callback) {
    this.callbacks.add(callback);
    callback(this.inputState); // Initial call
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }
  
  /**
   * Notify all subscribers of state changes
   */
  notifyCallbacks() {
    for (const callback of this.callbacks) {
      callback(this.inputState);
    }
  }
  
  /**
   * Clean up event listeners
   */
  destroy() {
    // Remove keyboard listeners
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    
    // Remove touch listeners
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
    
    // Remove mouse listeners
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
    
    this.callbacks.clear();
  }
}