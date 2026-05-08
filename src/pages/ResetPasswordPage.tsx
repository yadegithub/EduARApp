import { IonContent, IonIcon, IonPage } from "@ionic/react";
import {
  arrowBackOutline,
  eyeOffOutline,
  eyeOutline,
  keyOutline,
  lockClosedOutline,
  mailOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import BrandMark from "../components/BrandMark";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ResetPasswordPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialEmail = searchParams.get("email") ?? "";
  const resetCode = searchParams.get("oobCode") ?? "";
  const isCodeMode = Boolean(resetCode);
  const {
    authMode,
    authNotice,
    confirmPasswordReset,
    requestPasswordReset,
    verifyPasswordResetCode,
  } = useAuth();

  const [email, setEmail] = useState(initialEmail);
  const [resolvedEmail, setResolvedEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(isCodeMode);

  useEffect(() => {
    if (!isCodeMode || authMode !== "firebase") {
      setIsCheckingCode(false);
      return;
    }

    let isMounted = true;

    verifyPasswordResetCode(resetCode)
      .then((verifiedEmail) => {
        if (!isMounted) {
          return;
        }

        setResolvedEmail(verifiedEmail);
        setEmail(verifiedEmail);
        setError("");
      })
      .catch((verificationError) => {
        if (!isMounted) {
          return;
        }

        setError(
          verificationError instanceof Error
            ? verificationError.message
            : "Unable to verify this reset link.",
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingCode(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [authMode, isCodeMode, resetCode, verifyPasswordResetCode]);

  const goToLogin = () => {
    const nextEmail = resolvedEmail || email;
    const query = nextEmail
      ? `?email=${encodeURIComponent(nextEmail)}`
      : "";
    history.replace(`/login${query}`);
  };

  const handleSendResetLink = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!emailPattern.test(email.trim())) {
      setInfo("");
      setError("Enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setInfo("");
      await requestPasswordReset(email.trim());
      setInfo(
        "Reset link sent. Open the email link to choose your new password on this page.",
      );
    } catch (requestError) {
      setInfo("");
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to send the reset link right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReset = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (newPassword.trim().length < 6) {
      setInfo("");
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setInfo("");
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setInfo("");
      await confirmPasswordReset(resetCode, newPassword);
      const nextEmail = resolvedEmail || email;
      history.replace(
        `/login?reset=success${nextEmail ? `&email=${encodeURIComponent(nextEmail)}` : ""}`,
      );
    } catch (resetError) {
      setInfo("");
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Unable to reset your password right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="app-page">
        <div className="screen screen--login">
          <div className="screen__ambient screen__ambient--login-left" />
          <div className="screen__ambient screen__ambient--login-right" />

          <div className="login-shell">
            <section className="login-hero">
              <span className="spotlight-pill">
                {isCodeMode ? "Choose New Password" : "Reset Password"}
              </span>

              <div className="brand-hero brand-hero--login">
                <BrandMark className="brand-mark--hero" />
                <div className="brand-hero__copy">
                  <strong>AR Learn</strong>
                  <p>
                    {isCodeMode
                      ? "Create a new password, then sign in again with your updated account."
                      : "Enter your email to receive a reset link and continue on any device."}
                  </p>
                </div>
              </div>
            </section>

            <form
              className="login-card"
              onSubmit={isCodeMode ? handleConfirmReset : handleSendResetLink}
            >
              <div className="section-head section-head--compact">
                <h2>{isCodeMode ? "New password" : "Forgot password"}</h2>
              </div>

              {authMode !== "firebase" ? (
                <p className="auth-hint auth-hint--status">{authNotice}</p>
              ) : null}

              {isCheckingCode ? (
                <p className="auth-hint auth-hint--status">
                  Checking your reset link...
                </p>
              ) : null}

              {!isCodeMode ? (
                <label className="auth-field">
                  <span>Email</span>
                  <div className="auth-field__control">
                    <IonIcon icon={mailOutline} />
                    <input
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                        setInfo("");
                      }}
                    />
                  </div>
                </label>
              ) : (
                <>
                  <div className="auth-hint">
                    <strong>Account</strong>
                    <span>{resolvedEmail || email || "Checking account..."}</span>
                  </div>

                  <label className="auth-field">
                    <span>New Password</span>
                    <div className="auth-field__control">
                      <IonIcon icon={lockClosedOutline} />
                      <input
                        autoComplete="new-password"
                        placeholder="Create a new password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(event) => {
                          setNewPassword(event.target.value);
                          setError("");
                          setInfo("");
                        }}
                      />
                      <button
                        type="button"
                        className="auth-field__toggle"
                        aria-label={
                          showNewPassword ? "Hide password" : "Show password"
                        }
                        onClick={() =>
                          setShowNewPassword((currentValue) => !currentValue)
                        }
                      >
                        <IonIcon
                          icon={showNewPassword ? eyeOffOutline : eyeOutline}
                        />
                      </button>
                    </div>
                  </label>

                  <label className="auth-field">
                    <span>Confirm Password</span>
                    <div className="auth-field__control">
                      <IonIcon icon={keyOutline} />
                      <input
                        autoComplete="new-password"
                        placeholder="Repeat the new password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          setError("");
                          setInfo("");
                        }}
                      />
                      <button
                        type="button"
                        className="auth-field__toggle"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        onClick={() =>
                          setShowConfirmPassword(
                            (currentValue) => !currentValue,
                          )
                        }
                      >
                        <IonIcon
                          icon={showConfirmPassword ? eyeOffOutline : eyeOutline}
                        />
                      </button>
                    </div>
                  </label>
                </>
              )}

              {error ? <p className="auth-error">{error}</p> : null}
              {info ? <p className="auth-success">{info}</p> : null}

              <button
                type="submit"
                className="auth-submit"
                disabled={isSubmitting || isCheckingCode || authMode !== "firebase"}
              >
                <IonIcon
                  icon={isCodeMode ? keyOutline : mailOutline}
                />
                {isSubmitting
                  ? isCodeMode
                    ? "Updating password..."
                    : "Sending reset link..."
                  : isCodeMode
                    ? "Save New Password"
                    : "Send Reset Link"}
              </button>

              <div className="auth-switch">
                <span>Remembered your password?</span>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={goToLogin}
                >
                  <IonIcon icon={arrowBackOutline} />
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResetPasswordPage;
