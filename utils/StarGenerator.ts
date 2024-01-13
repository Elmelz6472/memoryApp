// StarGenerator.ts
interface Star {
  left: string;
  top: string;
}

const presetStarPositions: Star[] = [
  { left: '10%', top: '0%' },
  { left: '30%', top: '50%' },
  { left: '50%', top: '10%' },
  { left: '70%', top: '30%' },
  { left: '90%', top: '60%' },
  { left: '15%', top: '40%' },
  { left: '40%', top: '80%' },
  { left: '0%', top: '20%' },
  { left: '0%', top: '0%' },
  { left: '80%', top: '20%' },
  { left: '60%', top: '80%' },
  { left: '25%', top: '10%' },
  { left: '85%', top: '40%' },
  { left: '75%', top: '70%' },
  { left: '20%', top: '60%' },
  { left: '20%', top: '100%' },


];

const generateStars = (): Star[] => {
  return [...presetStarPositions];
};

export default generateStars;
