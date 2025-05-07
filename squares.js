const svgDimensions = {
  width: 500,
  height: 500,
};

const samplesMaxCount = 500;
const circlesRadius = 1;

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

const poissonDiskGenerator = async () => {
  const container = document.querySelector('#poisson-disk');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', svgDimensions.width);
  svg.setAttribute('height', svgDimensions.height);
  svg.setAttribute('style', 'background-color: black;');
  container.appendChild(svg);

  const minimumDistance = 10;
  const samplesBeforeRejection = 30;

  const sampler = new PoissonDiskSampler(
    svgDimensions.width,
    svgDimensions.height,
    minimumDistance,
    samplesBeforeRejection,
    async (point) => {
      const circle = getCircle(point.x, point.y);

      await new Promise((resolve) => setTimeout(resolve, 15));

      svg.appendChild(circle);
    }
  );

  await sampler.generatePoints();
};

uniformRandomGenerator();
poissonDiskGenerator();
