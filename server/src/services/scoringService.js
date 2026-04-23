const calculateMatchScore = (trader, client) => {
  let score = 0;

  // 1. Experience Match (30 pts)
  // Expert(30), Senior(20), Mid(10), Junior(5)
  if (client.complexity >= 8) {
    if (trader.level === 'Expert') score += 30;
    else if (trader.level === 'Senior') score += 20;
    else if (trader.level === 'Mid') score += 10;
  } else if (client.complexity >= 4) {
    if (trader.level === 'Senior') score += 30;
    else if (trader.level === 'Mid') score += 25;
    else if (trader.level === 'Expert') score += 20;
    else score += 5;
  } else {
    if (trader.level === 'Junior') score += 30;
    else if (trader.level === 'Mid') score += 20;
    else score += 10;
  }

  // 2. Skill Match (25 pts)
  if (trader.specialization && trader.specialization.includes(client.preferredSpecialization)) {
    score += 25;
  }

  // 3. Performance Score (25 pts)
  score += (trader.performanceScore / 100) * 25;

  // 4. Workload Penalty via Workload Service will be subtracted in the main engine logic
  // But we can add a base workload penalty here too if preferred

  return Math.max(0, Math.min(100, Math.round(score)));
};

module.exports = { calculateMatchScore };
