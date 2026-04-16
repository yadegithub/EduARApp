import type { AuthUser } from "../auth/auth-context";
import {
  achievements as demoAchievements,
  badgeTokens,
  experiences,
  getSubjectById,
  subjectProgress as demoSubjectProgress,
  subjects,
  type Achievement,
  type Experience,
  type SubjectId,
  type SubjectProgress,
} from "../data/arData";

const USER_PROGRESS_KEY = "arlearn.user-progress";
const DEMO_EMAIL = "sara@arlearn.app";

const subjectBadgeMap: Record<SubjectId, string> = {
  biology: "bio",
  physics: "atom",
  history: "legend",
  geography: "explorer",
};

export interface UserProgressProfile {
  badgesEarned: number;
  totalHours: number;
  levelsCompleted: number;
  highlightedBadgeIds: string[];
  achievements: Achievement[];
  subjectProgress: SubjectProgress[];
  visitedExperienceIds: string[];
}

type StoredProfiles = Record<string, UserProgressProfile>;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const cloneAchievement = (achievement: Achievement): Achievement => ({
  ...achievement,
});

const cloneSubjectProgress = (
  progressList: SubjectProgress[],
): SubjectProgress[] =>
  subjects.map((subject) => {
    const matchingProgress = progressList.find((progress) => progress.id === subject.id);

    return matchingProgress
      ? { ...matchingProgress }
      : {
          id: subject.id,
          completion: 0,
          status: "Start your first lesson",
          xpLabel: "0 XP",
        };
  });

const readStoredProfiles = (): StoredProfiles => {
  if (typeof window === "undefined") {
    return {};
  }

  const rawProfiles = window.localStorage.getItem(USER_PROGRESS_KEY);

  if (!rawProfiles) {
    return {};
  }

  try {
    return JSON.parse(rawProfiles) as StoredProfiles;
  } catch {
    return {};
  }
};

const writeStoredProfiles = (profiles: StoredProfiles) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(profiles));
};

const formatDateLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);

const parseXpLabel = (xpLabel: string) => {
  const numericPortion = xpLabel.replace(/[^\d.]/g, "");
  const parsedValue = Number.parseInt(numericPortion, 10);

  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

const parseDurationHours = (durationLabel: string) => {
  const parsedMinutes = Number.parseInt(durationLabel, 10);

  if (Number.isNaN(parsedMinutes)) {
    return 0;
  }

  return parsedMinutes / 60;
};

const roundHours = (hours: number) => Math.round(hours * 10) / 10;

const createStarterProfile = (user: AuthUser): UserProgressProfile => {
  const firstName = user.name.trim().split(/\s+/)[0] ?? "Learner";

  return {
    badgesEarned: 0,
    totalHours: 0,
    levelsCompleted: 0,
    highlightedBadgeIds: [],
    achievements: [
      {
        id: "account-created",
        title: "Account created",
        description: `${firstName}, your AR Learn profile is ready for its first lesson.`,
        time: formatDateLabel(new Date()),
      },
    ],
    subjectProgress: cloneSubjectProgress([]),
    visitedExperienceIds: [],
  };
};

const createDemoProfile = (): UserProgressProfile => ({
  badgesEarned: 26,
  totalHours: 180,
  levelsCompleted: 13,
  highlightedBadgeIds: badgeTokens.map((badge) => badge.id),
  achievements: demoAchievements.map(cloneAchievement),
  subjectProgress: cloneSubjectProgress(demoSubjectProgress),
  visitedExperienceIds: experiences.map((experience) => experience.id),
});

const buildInitialProfile = (user: AuthUser): UserProgressProfile =>
  normalizeEmail(user.email) === DEMO_EMAIL
    ? createDemoProfile()
    : createStarterProfile(user);

const normalizeProfile = (
  user: AuthUser,
  profile: Partial<UserProgressProfile> | undefined,
): UserProgressProfile => {
  const initialProfile = buildInitialProfile(user);

  return {
    badgesEarned:
      typeof profile?.badgesEarned === "number"
        ? profile.badgesEarned
        : initialProfile.badgesEarned,
    totalHours:
      typeof profile?.totalHours === "number"
        ? profile.totalHours
        : initialProfile.totalHours,
    levelsCompleted:
      typeof profile?.levelsCompleted === "number"
        ? profile.levelsCompleted
        : initialProfile.levelsCompleted,
    highlightedBadgeIds: Array.isArray(profile?.highlightedBadgeIds)
      ? profile.highlightedBadgeIds.filter((badgeId) =>
          badgeTokens.some((badge) => badge.id === badgeId),
        )
      : initialProfile.highlightedBadgeIds,
    achievements:
      Array.isArray(profile?.achievements) && profile.achievements.length > 0
        ? profile.achievements.map(cloneAchievement)
        : initialProfile.achievements.map(cloneAchievement),
    subjectProgress: Array.isArray(profile?.subjectProgress)
      ? cloneSubjectProgress(profile.subjectProgress)
      : initialProfile.subjectProgress,
    visitedExperienceIds: Array.isArray(profile?.visitedExperienceIds)
      ? profile.visitedExperienceIds
      : initialProfile.visitedExperienceIds,
  };
};

const saveProfile = (email: string, profile: UserProgressProfile) => {
  const normalizedEmail = normalizeEmail(email);
  const profiles = readStoredProfiles();

  writeStoredProfiles({
    ...profiles,
    [normalizedEmail]: profile,
  });
};

const unlockBadgeIds = (
  currentBadgeIds: string[],
  subjectId: SubjectId,
  subjectProgressList: SubjectProgress[],
) => {
  const nextBadgeIds = new Set(currentBadgeIds);

  nextBadgeIds.add(subjectBadgeMap[subjectId]);

  const allSubjectsStarted = subjectProgressList.every(
    (progress) => progress.completion > 0,
  );

  if (allSubjectsStarted) {
    nextBadgeIds.add("champion");
  }

  return Array.from(nextBadgeIds);
};

export const getUserProgressProfile = (user: AuthUser): UserProgressProfile => {
  const normalizedEmail = normalizeEmail(user.email);
  const storedProfiles = readStoredProfiles();
  const normalizedProfile = normalizeProfile(user, storedProfiles[normalizedEmail]);

  writeStoredProfiles({
    ...storedProfiles,
    [normalizedEmail]: normalizedProfile,
  });

  return normalizedProfile;
};

export const ensureUserProgressProfile = (user: AuthUser) =>
  getUserProgressProfile(user);

export const recordExperienceLaunch = (
  user: AuthUser,
  experience: Experience,
): UserProgressProfile => {
  const currentProfile = getUserProgressProfile(user);

  if (currentProfile.visitedExperienceIds.includes(experience.id)) {
    return currentProfile;
  }

  const nextSubjectProgress = currentProfile.subjectProgress.map((progress) => {
    if (progress.id !== experience.subjectId) {
      return progress;
    }

    const xpTotal = parseXpLabel(progress.xpLabel) + experience.xp;
    const completionBoost = Math.max(
      18,
      Math.min(32, Math.round(experience.xp / 8)),
    );
    const nextCompletion = Math.min(100, progress.completion + completionBoost);

    let nextStatus = "Lesson in progress";

    if (nextCompletion >= 100) {
      nextStatus = "Mastered";
    } else if (nextCompletion >= 65) {
      nextStatus = "Level unlocked";
    }

    return {
      ...progress,
      completion: nextCompletion,
      status: nextStatus,
      xpLabel: `${xpTotal} XP`,
    };
  });

  const nextBadgeIds = unlockBadgeIds(
    currentProfile.highlightedBadgeIds,
    experience.subjectId,
    nextSubjectProgress,
  );
  const subjectName = getSubjectById(experience.subjectId)?.name ?? "this subject";
  const nextProfile: UserProgressProfile = {
    badgesEarned: nextBadgeIds.length,
    totalHours: roundHours(
      currentProfile.totalHours + parseDurationHours(experience.duration),
    ),
    levelsCompleted: currentProfile.levelsCompleted + 1,
    highlightedBadgeIds: nextBadgeIds,
    achievements: [
      {
        id: `launch-${experience.id}`,
        title: `${experience.title} explored`,
        description: `You added fresh progress in ${subjectName} by opening this AR lesson.`,
        time: formatDateLabel(new Date()),
      },
      ...currentProfile.achievements.filter(
        (achievement) => achievement.id !== `launch-${experience.id}`,
      ),
    ].slice(0, 5),
    subjectProgress: nextSubjectProgress,
    visitedExperienceIds: [...currentProfile.visitedExperienceIds, experience.id],
  };

  saveProfile(user.email, nextProfile);

  return nextProfile;
};
