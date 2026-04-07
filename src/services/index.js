// SAPI API Services
// Centralized exports for all API service functions

export { fetchQuestions } from './questionService';
export { submitAssessment, getAssessmentResults, getAssessmentDetails } from './assessmentService';
export { generateRoadmap } from './roadmapService';
export { checkHealth } from './healthService';
export { register, login, logout, getToken, isAuthenticated, getCurrentUser } from './authService';
export { createProfile, getProfile, saveProfile, getProfileFromAPI, updateProfile } from './profileService';
export { 
  getDashboardStats, 
  getDashboardAssessments, 
  getDashboardFilters, 
  exportDashboardCSV 
} from './dashboardService';
