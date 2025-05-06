class PoissonDiskSampler {
  constructor(width, height, minimumDistance, samplesBeforeRejection = 30) {
    this.dimensions = {
      width,
      height,
    };
    this.minimumDistance = minimumDistance;
    this.samplesBeforeRejection = samplesBeforeRejection;
    this.dimensionsCount = 2; // We're working in 2D
    this.maximumDistance = 2 * minimumDistance;
    this.gridCellSize = minimumDistance / Math.sqrt(this.dimensionsCount);

    // Initialize grid
    this.gridWidth = Math.floor(width / this.gridCellSize);
    this.gridHeight = Math.floor(height / this.gridCellSize);
    this.grid = new Array(this.gridWidth * this.gridHeight);
  }

  random(value) {
    return Math.floor(Math.random() * value);
  }

  farEnough(newPosition) {
    const { x, y } = newPosition;
    const columnIndex = Math.floor(x / this.gridCellSize);
    const rowIndex = Math.floor(y / this.gridCellSize);

    const c0 = Math.max(0, columnIndex - 2);
    const r0 = Math.max(0, rowIndex - 2);
    const c1 = Math.min(columnIndex + 3, this.gridWidth);
    const r1 = Math.min(rowIndex + 3, this.gridHeight);

    for (let j = r0; j < r1; ++j) {
      const o = j * this.gridWidth;
      for (let i = c0; i < c1; ++i) {
        const s = this.grid[o + i];
        if (s) {
          const dx = s.x - x;
          const dy = s.y - y;
          if (dx * dx + dy * dy < this.minimumDistance ** 2) return false;
        }
      }
    }
    return true;
  }

  generatePoints() {
    const activeQueue = [];

    // Initialize with first random point
    const firstPoint = {
      x: this.random(this.dimensions.width),
      y: this.random(this.dimensions.height),
    };

    const columnIndex = Math.floor(firstPoint.x / this.gridCellSize);
    const rowIndex = Math.floor(firstPoint.y / this.gridCellSize);
    const gridIndex = rowIndex * this.gridWidth + columnIndex;

    activeQueue.push(firstPoint);
    this.grid[gridIndex] = firstPoint;

    while (activeQueue.length > 0) {
      const randomActiveQueueIndex = this.random(activeQueue.length);
      const currentPosition = activeQueue[randomActiveQueueIndex];

      for (let i = 0; i < this.samplesBeforeRejection; i++) {
        const randomAngle = Math.random() * Math.PI * 2;
        const maximumArea = this.maximumDistance ** 2;
        const minimumArea = this.minimumDistance ** 2;
        const differenceBetweenCircles = maximumArea - minimumArea;

        const randomRadius = Math.sqrt(
          Math.random() * differenceBetweenCircles + minimumArea
        );

        const newPosition = {
          x: currentPosition.x + Math.cos(randomAngle) * randomRadius,
          y: currentPosition.y + Math.sin(randomAngle) * randomRadius,
        };

        const isValid =
          newPosition.x >= 0 &&
          newPosition.x < this.dimensions.width &&
          newPosition.y >= 0 &&
          newPosition.y < this.dimensions.height &&
          this.farEnough(newPosition);

        if (isValid) {
          const columnIndex = Math.floor(newPosition.x / this.gridCellSize);
          const rowIndex = Math.floor(newPosition.y / this.gridCellSize);
          const gridIndex = rowIndex * this.gridWidth + columnIndex;

          this.grid[gridIndex] = newPosition;
          activeQueue.push(newPosition);
        }
      }

      activeQueue.splice(randomActiveQueueIndex, 1);
    }

    return this.grid;
  }
}
