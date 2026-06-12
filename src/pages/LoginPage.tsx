import { IonContent, IonIcon, IonPage } from "@ionic/react";
import {
  arrowForwardOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  logInOutline,
  mailOutline,
  personOutline,
} from "ionicons/icons";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { demoAccounts } from "../auth/demoAccounts";
import { useAuth } from "../auth/useAuth";
import BrandMark from "../components/BrandMark";
import { useAppSettings } from "../settings/AppSettingsContext";

interface LoginLocationState {
  from?: {
    pathname: string;
  };
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const loginCopy = {
  en: {
    welcome: "Welcome back",
    subtitle: "Sign in to continue your AR lessons on mobile.",
    login: "Login",
    restoring: "Restoring your session...",
    alreadySignedIn: "You are already signed in on this device.",
    continueDashboard: "Continue to Dashboard",
    switchAccount: "Switch Account",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    hidePassword: "Hide password",
    showPassword: "Show password",
    keepSignedIn: "Keep me signed in on this device",
    forgotPassword: "Forgot password?",
    signingIn: "Signing in...",
    signIn: "Sign In",
    useDemo: "Use Demo Login",
    demoAccount: "Demo account",
    demoPassword: "Password",
    newHere: "New here?",
    createAccount: "Create Account",
    invalidEmail: "Enter a valid email address.",
    shortPassword: "Password must be at least 6 characters.",
    signInError: "Unable to sign in right now.",
    invalidCredentials: "Invalid email or password.",
    localModeNotice:
      "Real auth is not active yet. Add Firebase config to use the same account on every device.",
    passwordUpdated:
      "Password updated. Sign in with your new password.",
  },
  ar: {
    welcome: "مرحباً بعودتك",
    subtitle: "سجل الدخول لمتابعة دروس الواقع المعزز على الهاتف.",
    login: "تسجيل الدخول",
    restoring: "جارٍ استعادة الجلسة...",
    alreadySignedIn: "أنت مسجل الدخول بالفعل على هذا الجهاز.",
    continueDashboard: "المتابعة إلى الرئيسية",
    switchAccount: "تبديل الحساب",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    password: "كلمة المرور",
    passwordPlaceholder: "أدخل كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    showPassword: "إظهار كلمة المرور",
    keepSignedIn: "أبقني مسجل الدخول على هذا الجهاز",
    forgotPassword: "نسيت كلمة المرور؟",
    signingIn: "جارٍ تسجيل الدخول...",
    signIn: "دخول",
    useDemo: "استخدام حساب تجريبي",
    demoAccount: "الحساب التجريبي",
    demoPassword: "كلمة المرور",
    newHere: "جديد هنا؟",
    createAccount: "إنشاء حساب",
    invalidEmail: "أدخل بريداً إلكترونياً صحيحاً.",
    shortPassword: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.",
    signInError: "تعذر تسجيل الدخول الآن.",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    localModeNotice:
      "المصادقة الحقيقية غير مفعّلة بعد. أضف إعدادات Firebase لاستخدام الحساب نفسه على كل جهاز.",
    passwordUpdated:
      "تم تحديث كلمة المرور. سجّل الدخول بكلمة المرور الجديدة.",
  },
  fr: {
    welcome: "Bon retour",
    subtitle: "Connectez-vous pour continuer vos leçons AR sur mobile.",
    login: "Connexion",
    restoring: "Restauration de votre session...",
    alreadySignedIn: "Vous êtes déjà connecté sur cet appareil.",
    continueDashboard: "Continuer vers le tableau de bord",
    switchAccount: "Changer de compte",
    email: "E-mail",
    emailPlaceholder: "you@example.com",
    password: "Mot de passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    hidePassword: "Masquer le mot de passe",
    showPassword: "Afficher le mot de passe",
    keepSignedIn: "Rester connecté sur cet appareil",
    forgotPassword: "Mot de passe oublié ?",
    signingIn: "Connexion en cours...",
    signIn: "Se connecter",
    useDemo: "Utiliser le compte démo",
    demoAccount: "Compte démo",
    demoPassword: "Mot de passe",
    newHere: "Nouveau ici ?",
    createAccount: "Créer un compte",
    invalidEmail: "Entrez une adresse e-mail valide.",
    shortPassword: "Le mot de passe doit contenir au moins 6 caractères.",
    signInError: "Connexion impossible pour le moment.",
    invalidCredentials: "E-mail ou mot de passe invalide.",
    localModeNotice:
      "L'authentification réelle n'est pas encore active. Ajoutez la configuration Firebase pour utiliser le même compte sur chaque appareil.",
    passwordUpdated:
      "Mot de passe mis à jour. Connectez-vous avec votre nouveau mot de passe.",
  },
} as const;

const LoginPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LoginLocationState>();
  const searchParams = new URLSearchParams(location.search);
  const {
    authMode,
    authNotice,
    isAuthenticated,
    isReady,
    login,
    logout,
    user,
  } = useAuth();
  const { settings } = useAppSettings();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = loginCopy[settings.language] ?? loginCopy.en;
  const [resetFeedback, setResetFeedback] = useState(
    searchParams.get("reset") === "success" ? copy.passwordUpdated : "",
  );

  const redirectTo = location.state?.from?.pathname ?? "/tabs/dashboard";
  const visibleAuthNotice =
    authMode === "local" ? copy.localModeNotice : authNotice;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailPattern.test(email.trim())) {
      setResetFeedback("");
      setError(copy.invalidEmail);
      return;
    }

    if (password.trim().length < 6) {
      setResetFeedback("");
      setError(copy.shortPassword);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setResetFeedback("");
      await login({ email, password, rememberMe });
      history.replace(redirectTo);
    } catch (loginError) {
      if (
        authMode === "local" &&
        loginError instanceof Error &&
        loginError.message.startsWith("Invalid email or password.")
      ) {
        setError(`${copy.invalidCredentials} ${copy.localModeNotice}`);
      } else {
        setError(
          loginError instanceof Error ? loginError.message : copy.signInError,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToResetPassword = () => {
    const nextEmail = email.trim();
    history.push(
      nextEmail
        ? `/reset-password?email=${encodeURIComponent(nextEmail)}`
        : "/reset-password",
    );
  };

  const useDemoAccess = () => {
    setEmail(demoAccounts[0].email);
    setPassword(demoAccounts[0].password);
    setError("");
    setResetFeedback("");
  };

  const continueWithCurrentSession = () => {
    history.replace(redirectTo);
  };

  const switchAccount = () => {
    logout();
    setEmail("");
    setPassword("");
    setError("");
    setResetFeedback("");
  };

  return (
    <IonPage>
      <IonContent fullscreen className="app-page">
        <div className="screen screen--login">
          <div className="screen__ambient screen__ambient--login-left" />
          <div className="screen__ambient screen__ambient--login-right" />

          <div className="login-shell">
            <section className="login-hero">
              <span className="spotlight-pill">{copy.welcome}</span>

              <div className="brand-hero brand-hero--login">
                <BrandMark className="brand-mark--hero" />
                <div className="brand-hero__copy">
                  <p>{copy.subtitle}</p>
                </div>
              </div>
            </section>

            <form className="login-card" onSubmit={handleSubmit}>
              <div className="section-head section-head--compact">
                <h2>{copy.login}</h2>
              </div>

              {!isReady ? (
                <p className="auth-hint auth-hint--status">{copy.restoring}</p>
              ) : null}

              {visibleAuthNotice ? (
                <p className="auth-hint auth-hint--status">{visibleAuthNotice}</p>
              ) : null}

              {isAuthenticated ? (
                <div className="auth-session-card">
                  <div className="auth-session-card__copy">
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                    <p>{copy.alreadySignedIn}</p>
                  </div>

                  <div className="auth-session-card__actions">
                    <button
                      type="button"
                      className="auth-submit"
                      onClick={continueWithCurrentSession}
                    >
                      <IonIcon icon={arrowForwardOutline} />
                      {copy.continueDashboard}
                    </button>
                    <button
                      type="button"
                      className="auth-demo"
                      onClick={switchAccount}
                    >
                      <IonIcon icon={personOutline} />
                      {copy.switchAccount}
                    </button>
                  </div>
                </div>
              ) : null}

              <label className="auth-field">
                <span>{copy.email}</span>
                <div className="auth-field__control">
                  <IonIcon icon={mailOutline} />
                  <input
                    autoComplete="email"
                    inputMode="email"
                    placeholder={copy.emailPlaceholder}
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                      setResetFeedback("");
                    }}
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>{copy.password}</span>
                <div className="auth-field__control">
                  <IonIcon icon={lockClosedOutline} />
                  <input
                    autoComplete="current-password"
                    placeholder={copy.passwordPlaceholder}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                  />
                  <button
                    type="button"
                    className="auth-field__toggle"
                    aria-label={
                      showPassword ? copy.hidePassword : copy.showPassword
                    }
                    onClick={() => setShowPassword((currentValue) => !currentValue)}
                  >
                    <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>
              </label>

              <label className="remember-toggle">
                <input
                  checked={rememberMe}
                  type="checkbox"
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span>{copy.keepSignedIn}</span>
              </label>

              {authMode === "firebase" ? (
                <div className="auth-helper-row">
                  <button
                    type="button"
                    className="auth-link-button"
                    onClick={goToResetPassword}
                  >
                    {copy.forgotPassword}
                  </button>
                </div>
              ) : null}

              {error ? <p className="auth-error">{error}</p> : null}
              {resetFeedback ? (
                <p className="auth-success">{resetFeedback}</p>
              ) : null}

              <button
                type="submit"
                className="auth-submit"
                disabled={isSubmitting}
              >
                <IonIcon icon={logInOutline} />
                {isSubmitting ? copy.signingIn : copy.signIn}
              </button>

              {authMode === "local" ? (
                <>
                  <button
                    type="button"
                    className="auth-demo"
                    onClick={useDemoAccess}
                  >
                    <IonIcon icon={personOutline} />
                    {copy.useDemo}
                  </button>

                  <div className="auth-hint">
                    <strong>{copy.demoAccount}</strong>
                    <span>{demoAccounts[0].email}</span>
                    <span>
                      {copy.demoPassword}: {demoAccounts[0].password}
                    </span>
                  </div>
                </>
              ) : null}

              <div className="auth-switch">
                <span>{copy.newHere}</span>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => history.push("/register")}
                >
                  {copy.createAccount}
                </button>
              </div>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
