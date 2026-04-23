const getWorkloadPenalty = (trader) => {
  const loadPercentage = (trader.currentLoad / trader.capacity) * 100;
  if (loadPercentage > 85) return 20;
  if (loadPercentage > 60) return 10;
  if (loadPercentage > 30) return 5;
  return 0;
};

const isOverloaded = (trader) => {
  return (trader.currentLoad / trader.capacity) >= 0.85;
};

const getLoadStats = (traders) => {
  return traders.map(t => ({
    name: t.name,
    loadPct: Math.round((t.currentLoad / t.capacity) * 100),
    isFlagged: isOverloaded(t)
  }));
};

module.exports = { getWorkloadPenalty, isOverloaded, getLoadStats };
