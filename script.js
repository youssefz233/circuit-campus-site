const header = document.querySelector(".site-header");
const onboarding = document.querySelector("[data-onboarding]");
const onboardingForm = document.querySelector("[data-onboarding-form]");
const onboardingOpenButtons = document.querySelectorAll("[data-onboarding-open]");
const onboardingCloseButtons = document.querySelectorAll("[data-onboarding-close]");
const onboardingSteps = onboardingForm ? Array.from(onboardingForm.querySelectorAll("[data-step]")) : [];
const onboardingProgress = onboardingForm ? Array.from(onboardingForm.querySelectorAll(".onboarding-progress span")) : [];
const stepLabel = document.querySelector("[data-step-label]");
const backButton = document.querySelector("[data-onboarding-back]");
const nextButton = document.querySelector("[data-onboarding-next]");
const submitButton = document.querySelector("[data-onboarding-submit]");
const formError = document.querySelector("[data-form-error]");

let currentOnboardingStep = 0;

function syncHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function setError(message) {
  if (!formError) return;
  formError.textContent = message || "";
}

function getFormValue(name) {
  if (!onboardingForm) return "";
  const data = new FormData(onboardingForm);
  return String(data.get(name) || "").trim();
}

function updateSummary() {
  if (!onboardingForm) return;

  const summaries = {
    name: `${getFormValue("firstName")} ${getFormValue("lastName")}`.trim() || "-",
    email: getFormValue("email") || "-",
    company: getFormValue("company") || "-",
    goal: getFormValue("goal") || "-",
    campuses: getFormValue("campuses") || "-",
    timeline: getFormValue("timeline") || "-",
  };

  Object.entries(summaries).forEach(([key, value]) => {
    const node = onboardingForm.querySelector(`[data-summary="${key}"]`);
    if (node) node.textContent = value;
  });
}

function showOnboardingStep(index) {
  if (!onboardingSteps.length) return;

  currentOnboardingStep = Math.max(0, Math.min(index, onboardingSteps.length - 1));
  onboardingSteps.forEach((step, stepIndex) => {
    step.classList.toggle("is-active", stepIndex === currentOnboardingStep);
  });
  onboardingProgress.forEach((step, stepIndex) => {
    step.classList.toggle("is-active", stepIndex <= currentOnboardingStep);
  });

  if (stepLabel) stepLabel.textContent = `Step ${currentOnboardingStep + 1}`;
  if (backButton) backButton.disabled = currentOnboardingStep === 0;
  if (nextButton) nextButton.hidden = currentOnboardingStep === onboardingSteps.length - 1;
  if (submitButton) submitButton.hidden = currentOnboardingStep !== onboardingSteps.length - 1;

  setError("");
  if (currentOnboardingStep === onboardingSteps.length - 1) updateSummary();
}

function validateCurrentStep() {
  const step = onboardingSteps[currentOnboardingStep];
  if (!step || !onboardingForm) return true;

  const requiredFields = Array.from(step.querySelectorAll("[required]"));
  let invalidField = null;

  requiredFields.some((field) => {
    if (field.type === "radio") {
      const checked = onboardingForm.querySelector(`input[name="${field.name}"]:checked`);
      if (!checked) invalidField = field;
    } else if (!field.value.trim() || !field.checkValidity()) {
      invalidField = field;
    }
    return Boolean(invalidField);
  });

  if (!invalidField) {
    setError("");
    return true;
  }

  const stepMessages = [
    "Add your name and work email so we know where to send the Google Meet.",
    "Add the brand details so Circuit can map the right campus angle.",
    "Choose the first activation goal.",
    "Add the schools and timeline for the first wave.",
    "Review the summary, then request the Google Meet.",
  ];

  setError(stepMessages[currentOnboardingStep] || "Please complete the required fields.");
  if (invalidField.type !== "radio") invalidField.focus({ preventScroll: true });
  return false;
}

function openOnboarding() {
  if (!onboarding) return;
  onboarding.hidden = false;
  document.body.classList.add("modal-open");
  showOnboardingStep(currentOnboardingStep);

  window.setTimeout(() => {
    const focusTarget = onboarding.querySelector(".onboarding-step.is-active input, .onboarding-step.is-active textarea, .onboarding-close");
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  }, 60);
}

function closeOnboarding() {
  if (!onboarding) return;
  onboarding.hidden = true;
  document.body.classList.remove("modal-open");
}

onboardingOpenButtons.forEach((button) => {
  button.addEventListener("click", openOnboarding);
});

onboardingCloseButtons.forEach((button) => {
  button.addEventListener("click", closeOnboarding);
});

if (backButton) {
  backButton.addEventListener("click", () => {
    showOnboardingStep(currentOnboardingStep - 1);
  });
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    if (!validateCurrentStep()) return;
    showOnboardingStep(currentOnboardingStep + 1);
  });
}

if (onboardingForm) {
  onboardingForm.addEventListener("input", () => setError(""));
  onboardingForm.addEventListener("change", () => setError(""));
  onboardingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateCurrentStep()) return;

    const details = {
      name: `${getFormValue("firstName")} ${getFormValue("lastName")}`.trim(),
      email: getFormValue("email"),
      company: getFormValue("company"),
      website: getFormValue("website"),
      product: getFormValue("product"),
      goal: getFormValue("goal"),
      campuses: getFormValue("campuses"),
      timeline: getFormValue("timeline"),
    };

    const body = [
      "Hey Circuit,",
      "",
      "I'd like to book a Google Meet for a college creator program.",
      "",
      `Name: ${details.name}`,
      `Email: ${details.email}`,
      `Company: ${details.company}`,
      `Website: ${details.website}`,
      `Product: ${details.product}`,
      `Goal: ${details.goal}`,
      `Priority schools: ${details.campuses}`,
      `Timeline: ${details.timeline}`,
    ].join("\n");

    window.location.href = `mailto:hello@circuitcampus.com?subject=${encodeURIComponent(
      `Circuit Google Meet request - ${details.company || details.name}`,
    )}&body=${encodeURIComponent(body)}`;
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && onboarding && !onboarding.hidden) {
    closeOnboarding();
  }
});

showOnboardingStep(0);
