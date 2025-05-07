class TrianglePoissonDiskSampler extends PoissonDiskSampler {
  constructor(sides, minimumDistance, samplesBeforeRejection, onPointAdded) {
    const { a, b, c } = sides;

    const maxX = Math.max(a[0], b[0], c[0]);
    const maxY = Math.max(a[1], b[1], c[1]);

    super(maxX, maxY, minimumDistance, samplesBeforeRejection, onPointAdded);

    this.sides = sides;
  }

  isInsideTriangle(px, py) {
    const { a, b, c } = this.sides;

    const area = (a[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (a[1] - c[1]);
    const s =
      ((a[0] - c[0]) * (py - c[1]) - (a[1] - c[1]) * (px - c[0])) / area;
    const t =
      ((c[0] - b[0]) * (py - c[1]) - (c[1] - b[1]) * (px - c[0])) / area;
    const u = 1 - s - t;
    return s >= 0 && t >= 0 && u >= 0;
  }

  async generatePoints() {
    const activeQueue = [];

    let firstPointValid = false;
    let firstPoint;

    while (!firstPointValid) {
      firstPoint = {
        x: this.random(this.dimensions.width),
        y: this.random(this.dimensions.height),
      };

      firstPointValid = this.isInsideTriangle(firstPoint.x, firstPoint.y);
    }

    const columnIndex = Math.floor(firstPoint.x / this.gridCellSize);
    const rowIndex = Math.floor(firstPoint.y / this.gridCellSize);
    const gridIndex = rowIndex * this.gridWidth + columnIndex;

    activeQueue.push(firstPoint);
    this.grid[gridIndex] = firstPoint;

    await this.onPointAdded(firstPoint, gridIndex);

    while (activeQueue.length > 0) {
      const randomActiveQueueIndex = this.random(activeQueue.length);
      const currentPosition = activeQueue[randomActiveQueueIndex];

      let foundValidPoint = false;

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
          this.isInsideTriangle(newPosition.x, newPosition.y) &&
          this.farEnoughFromNeighbours(newPosition);

        if (isValid) {
          const columnIndex = Math.floor(newPosition.x / this.gridCellSize);
          const rowIndex = Math.floor(newPosition.y / this.gridCellSize);
          const gridIndex = rowIndex * this.gridWidth + columnIndex;

          this.grid[gridIndex] = newPosition;
          activeQueue.push(newPosition);
          foundValidPoint = true;

          await this.onPointAdded(newPosition, gridIndex);

          break;
        }
      }

      if (!foundValidPoint) {
        activeQueue.splice(randomActiveQueueIndex, 1);
      }
    }

    return this.grid.filter(Boolean);
  }
}
