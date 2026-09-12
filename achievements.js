const achievementNames = {
  female: ['普美', '小美', '中美', '大美', '顶美'],
  male: ['普帅', '小帅', '中帅', '大帅', '顶帅']
};

function getAchievements(profile) {
  const names = achievementNames[profile.gender] || [];
  const eligible = profile.ratings >= 50 && profile.score !== null && Number.isFinite(Number(profile.score)) && Number(profile.score) <= 10;
  return names.map((name, index) => ({ name, threshold: index + 5, unlocked: eligible && Number(profile.score) >= index + 5 }));
}

function getAchievementTitle(profile) {
  return getAchievements(profile).filter(achievement => achievement.unlocked).at(-1)?.name || '待点亮';
}
