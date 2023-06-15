export class SwipeContainerColor {
  private swipeContainer: HTMLElement;
  private maxSwipeDistance: number;
  private intensity: number;
  private tolerance: number;

  constructor(card1: boolean) {
    const swipeContainerId = card1 ? 'color-container1' : 'color-container2';
    this.swipeContainer = document.querySelector(`#${swipeContainerId}`) as HTMLElement;
    this.maxSwipeDistance = 150;
    this.intensity = 0.5;
    this.tolerance = 50;
  }

  updateColor(deltaX: number) {
    if (Math.abs(deltaX) >= this.maxSwipeDistance) {
      if (deltaX < 0) {
        // left
        this.swipeContainer.style.transition = 'background-color 0.5s ease';
        this.swipeContainer.style.backgroundColor = `rgba(255, 0, 0, ${this.intensity})`;
      } else {
        // right
        this.swipeContainer.style.transition = 'background-color 0.5s ease';
        this.swipeContainer.style.backgroundColor = `rgba(0, 255, 0, ${this.intensity})`;
      }
    } else {
      // Calculate opacity based on swipe distance
      const opacity = (Math.abs(deltaX) - this.tolerance) / (this.maxSwipeDistance - this.tolerance);

      if (deltaX < 0) {
        // left
        this.swipeContainer.style.transition = 'background-color 0.5s ease';
        this.swipeContainer.style.backgroundColor = `rgba(255, 0, 0, ${opacity * this.intensity})`;
      } else {
        // right
        this.swipeContainer.style.transition = 'background-color 0.5s ease';
        this.swipeContainer.style.backgroundColor = `rgba(0, 255, 0, ${opacity * this.intensity})`;
      }

      if (Math.abs(deltaX) < this.tolerance) {
        // Reset color
        this.swipeContainer.style.transition = 'background-color 0.5s ease';
        this.swipeContainer.style.backgroundColor = 'transparent';
      }
    }
  }

  clearColorContainer() {
    this.swipeContainer.style.backgroundColor = 'transparent';
  }
}
