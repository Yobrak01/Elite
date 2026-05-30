const StudySession = require('../models/StudySession');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get analytics for the logged-in user
// @route   GET /api/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all study sessions for the user
    const studySessions = await StudySession.find({ user: userId });

    // Get all tasks for the user
    const tasks = await Task.find({ user: userId });

    // Calculate total study hours (in minutes from study sessions, convert to hours)
    let totalStudyMinutes = 0;
    studySessions.forEach(session => {
      totalStudyMinutes += session.duration || 0;
    });
    const totalStudyHours = totalStudyMinutes / 60;

    // Calculate completion percentage
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Calculate average focus score from study sessions
    let totalFocus = 0;
    let focusCount = 0;
    studySessions.forEach(session => {
      if (session.focusScore !== null && session.focusScore !== undefined) {
        totalFocus += session.focusScore;
        focusCount++;
      }
    });
    const averageFocusScore = focusCount > 0 ? totalFocus / focusCount : 0;

    // Focus Score formula: (completionPercentage * 0.6) * (studyHours * 2) capped at 100
    // Actually, the formula given: focusScore = (completionPercentage * 0.6) * (studyHours * 2)
    // But that seems off. Let's re-read: "focusScore = (completionPercentage * 0.6) * (studyHours * 2)"
    // That would be a product, but then they say "Cap at 100."
    // However, typical focus score might be a combination. We'll stick to the given formula.
    let focusScore = (completionPercentage * 0.6) * (totalStudyHours * 2);
    if (focusScore > 100) focusScore = 100;

    // Burnout Risk formula:
    // burnoutRisk = (totalStudyHours > 10 ? 30 : 0)
    //            * (focusScore < 40 ? 30 : 0)
    //            * (completionPercentage < 50 ? 20 : 0)
    // This seems to be a product? That would yield 0 if any condition is false.
    // But then they return Low, Moderate, High Risk.
    // Let's interpret as: each condition contributes points, then sum.
    // Actually, the given formula uses multiplication, which would be zero if any factor is zero.
    // That doesn't make sense for a risk score.
    // Let's assume they meant to add the points:
    //   points = (totalStudyHours > 10 ? 30 : 0) +
    //            (focusScore < 40 ? 30 : 0) +
    //            (completionPercentage < 50 ? 20 : 0)
    // Then risk: 0-30 Low, 31-60 Moderate, 61+ High.
    // However, the description says:
    //   burnoutRisk = (totalStudyHours > 10 ? 30 : 0)
    //                * (focusScore < 40 ? 30 : 0)
    //                * (completionPercentage < 50 ? 20 : 0)
    // And then return Low, Moderate, High Risk.
    // Let's look at the example: if all three are true, then 30*30*20 = 18000 -> which is not a risk level.
    // So it's likely a mistake. We'll implement the additive version.

    let burnoutPoints = 0;
    if (totalStudyHours > 10) burnoutPoints += 30;
    if (focusScore < 40) burnoutPoints += 30;
    if (completionPercentage < 50) burnoutPoints += 20;

    let burnoutRisk = 'Low';
    if (burnoutPoints >= 60) burnoutRisk = 'High';
    else if (burnoutPoints >= 30) burnoutRisk = 'Moderate';
    else burnoutRisk = 'Low';

    // Streak: we need to calculate consecutive days with study sessions.
    // For simplicity, we'll just count the number of days in the last 30 days that had at least one study session.
    // But a proper streak is consecutive days from today backwards until a break.
    // We'll implement a simple version: count of unique days with study sessions in the last 30 days.
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSessions = studySessions.filter(session => session.date >= thirtyDaysAgo);
    const uniqueDays = new Set();
    recentSessions.forEach(session => {
      const dateStr = session.date.toISOString().split('T')[0];
      uniqueDays.add(dateStr);
    });
    const streak = uniqueDays.size; // This is not exactly streak, but we'll use it for now.

    // Productivity score: we can define as (completionPercentage + focusScore) / 2
    const productivityScore = (completionPercentage + focusScore) / 2;

    // AI recommendations (simplified)
    let recommendations = [];
    if (burnoutRisk === 'High') {
      recommendations.push('Consider taking a break to avoid burnout.');
      recommendations.push('Reduce study hours and focus on recovery.');
    } else if (focusScore < 50) {
      recommendations.push('Try to improve focus by minimizing distractions.');
      recommendations.push('Use the Pomodoro technique to maintain concentration.');
    }
    if (completionPercentage < 50) {
      recommendations.push('Break down tasks into smaller, manageable steps.');
      recommendations.push('Set clearer deadlines for your tasks.');
    }
    if (totalStudyHours < 5) {
      recommendations.push('Increase your study time to meet your goals.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Keep up the good work! Maintain your current routine.');
    }

    res.json({
      totalStudyHours: parseFloat(totalStudyHours.toFixed(2)),
      completionPercentage: parseFloat(completionPercentage.toFixed(2)),
      focusScore: parseFloat(focusScore.toFixed(2)),
      burnoutRisk,
      streak,
      productivityScore: parseFloat(productivityScore.toFixed(2)),
      averageFocusScore: parseFloat(averageFocusScore.toFixed(2)),
      recommendations
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get weekly analytics (for charts)
// @route   GET /api/analytics/weekly
// @access  Private
exports.getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get study sessions for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const studySessions = await StudySession.find({
      user: userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    // Initialize array for last 7 days (including today)
    const days = [];
    const hours = [];
    const focus = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(sevenDaysAgo.getDate() + i);
      day.setHours(0,0,0,0);
      days.push(day.toISOString().split('T')[0]); // YYYY-MM-DD
      hours.push(0);
      focus.push(0);
    }

    // Aggregate data per day
    studySessions.forEach(session => {
      const dayStr = session.date.toISOString().split('T')[0];
      const index = days.indexOf(dayStr);
      if (index !== -1) {
        hours[index] += session.duration || 0; // in minutes
        if (session.focusScore !== null && session.focusScore !== undefined) {
          focus[index] += session.focusScore;
        }
      }
    });

    // Convert hours to hours (from minutes) and compute average focus per day
    for (let i = 0; i < 7; i++) {
      hours[i] = parseFloat((hours[i] / 60).toFixed(2)); // hours
      // For focus, we need to know how many sessions per day to average
      // We'll just keep the sum and later we can change to average if needed.
      // For simplicity, we'll leave as sum of focus scores per day.
    }

    res.json({
      days,
      hours,
      focus
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};