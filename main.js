const svgDimensions = {
  width: 500,
  height: 500,
};

const samplesMaxCount = 1000;
const circlesRadius = 2;

const getCircle = (x, y) => {
  const circle = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'circle'
  );
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', circlesRadius);
  circle.setAttribute('fill', 'white');
  return circle;
};

const uniformRandomGenerator = () => {
  const uniformRandom = document.querySelector('#uniform-random');

  for (let i = 0; i < samplesMaxCount; i++) {
    const x = Math.random();
    const y = Math.random();

    const circle = getCircle(x * svgDimensions.width, y * svgDimensions.height);
    uniformRandom.appendChild(circle);
  }
};

uniformRandomGenerator();

const minimumDistance = 10; // r
const dimensionsCount = 2; // n, 2D
const limitOfSamples = 30; // k - maximum number of samples before rejection
const maximumDistance = 2 * minimumDistance; // 2r

const random = (value) => {
  return Math.floor(Math.random() * value);
};

const poissonDiskGenerator = () => {
  const poissonDisk = document.querySelector('#poisson-disk');

  // Step 0
  // Calculate grid cell size r / sqrt(n)
  const gridCellSize = minimumDistance / Math.sqrt(dimensionsCount);

  // Step 1
  // Initialize grid
  const gridWidth = Math.floor(svgDimensions.width / gridCellSize);
  const gridHeight = Math.floor(svgDimensions.height / gridCellSize);
  const gridCellsCount = gridWidth * gridHeight;
  const grid = new Array(gridCellsCount);

  // Initialize first random sample
  const x = random(svgDimensions.width);
  const y = random(svgDimensions.height);
  const columnIndex = Math.floor(x / gridCellSize);
  const rowIndex = Math.floor(y / gridCellSize);
  const activeQueue = [];
  // If col = 3 and row = 2
  // Columns count is 5
  // To know what cell we are in, we need to multiply row index by columns count and add column index
  const gridIndex = rowIndex * gridWidth + columnIndex;
  const position = {
    x,
    y,
  };
  activeQueue.push(position);
  grid[gridIndex] = position;

  const farEnough = (newPositions) => {
    const { x, y } = newPositions;

    const i = Math.floor(x / gridCellSize);
    const j = Math.floor(y / gridCellSize);

    const i0 = Math.max(0, i - 2);
    const j0 = Math.max(0, j - 2);
    const i1 = Math.min(i + 3, gridWidth);
    const j1 = Math.min(j + 3, gridHeight);

    for (let j = j0; j < j1; ++j) {
      const o = j * gridWidth;
      for (let i = i0; i < i1; ++i) {
        const s = grid[o + i];

        if (s) {
          const dx = s.x - x;
          const dy = s.y - y;
          if (dx * dx + dy * dy < minimumDistance ** 2) return false;
        }
      }
    }

    return true;
  };

  while (activeQueue.length > 0) {
    // Choose random index from active list
    const randomActiveQueueIndex = random(activeQueue.length);

    const currentPosition = activeQueue[randomActiveQueueIndex];

    // Generate up to k points chosen uniformly from the spherical annulus between radius r and 2r around xi.
    for (let i = 0; i < limitOfSamples; i++) {
      console.log('currentPosition :>> ', currentPosition);

      const randomAngle = random(2 * Math.PI);

      // Random value between r and 2r
      const maximumArea = maximumDistance ** 2;
      const minimumArea = minimumDistance ** 2;
      const differenceBetweenCircles = maximumArea - minimumArea;

      // We add minumum value to random to shift random value so it will be bigger then mimimum
      const randomRadius = Math.sqrt(
        Math.random() * differenceBetweenCircles + minimumArea
      );

      const x = Math.cos(randomAngle) * randomRadius;
      const y = Math.sin(randomAngle) * randomRadius;

      const newPosition = {
        x: currentPosition.x + x,
        y: currentPosition.y + y,
      };

      const isValid =
        newPosition.x >= 0 &&
        newPosition.x < svgDimensions.width &&
        newPosition.y >= 0 &&
        newPosition.y < svgDimensions.height &&
        farEnough(newPosition);

      if (isValid) {
        grid[
          gridWidth * Math.floor(newPosition.y / gridCellSize) +
            Math.floor(newPosition.x / gridCellSize)
        ] = newPosition;

        activeQueue.push(newPosition);
      }
    }

    activeQueue.splice(randomActiveQueueIndex, 1);
  }

  console.log('grid :>> ', grid);

  grid.forEach((position) => {
    const circle = getCircle(position.x, position.y);
    poissonDisk.appendChild(circle);
  });
};

poissonDiskGenerator();
