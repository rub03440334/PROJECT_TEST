/**
 * PlayerController - Handles player movement based on input intents
 */
export class PlayerController {
  constructor(inputManager, elementId = 'player') {
    this.inputManager = inputManager;
    this.playerElement = document.getElementById(elementId);
    
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.speed = 5;
    this.bounds = this.calculateBounds();
    
    this.init();
  }
  
  init() {
    // Subscribe to input state changes
    this.inputManager.subscribe((state) => {
      this.handleInputState(state);
    });
    
    // Set initial position
    this.centerPlayer();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.bounds = this.calculateBounds();
      this.constrainPlayerPosition();
    });
  }
  
  /**
   * Calculate screen bounds for player movement
   */
  calculateBounds() {
    const gameArea = document.getElementById('game-area');
    const rect = gameArea.getBoundingClientRect();
    
    return {
      left: 0,
      right: rect.width - 50, // player width
      top: 0,
      bottom: rect.height - 50 // player height
    };
  }
  
  /**
   * Center the player in the game area
   */
  centerPlayer() {
    const gameArea = document.getElementById('game-area');
    const rect = gameArea.getBoundingClientRect();
    
    this.position.x = (rect.width - 50) / 2; // player width
    this.position.y = (rect.height - 50) / 2; // player height
    
    this.updatePlayerPosition();
  }
  
  /**
   * Handle input state changes from InputManager
   */
  handleInputState(state) {
    // Update velocity based on input intents
    this.velocity.x = 0;
    
    if (state.leftIntent) {
      this.velocity.x = -this.speed;
    }
    if (state.rightIntent) {
      this.velocity.x = this.speed;
    }
    
    // Handle simultaneous key presses (both directions pressed = no movement)
    if (state.leftIntent && state.rightIntent) {
      this.velocity.x = 0;
    }
    
    // Update position
    this.updatePosition();
  }
  
  /**
   * Update player position based on velocity
   */
  updatePosition() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    
    this.constrainPlayerPosition();
    this.updatePlayerPosition();
  }
  
  /**
   * Keep player within screen bounds
   */
  constrainPlayerPosition() {
    this.position.x = Math.max(this.bounds.left, Math.min(this.bounds.right, this.position.x));
    this.position.y = Math.max(this.bounds.top, Math.min(this.bounds.bottom, this.position.y));
  }
  
  /**
   * Update the DOM element position
   */
  updatePlayerPosition() {
    if (this.playerElement) {
      this.playerElement.style.left = `${this.position.x}px`;
      this.playerElement.style.top = `${this.position.y}px`;
    }
  }
  
  /**
   * Get current player state
   */
  getState() {
    return {
      position: { ...this.position },
      velocity: { ...this.velocity }
    };
  }
}