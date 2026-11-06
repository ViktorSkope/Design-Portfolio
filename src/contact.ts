// The "Get in touch" popover, carried over from the previous portfolio: WhatsApp,
// email, and a quick hello that Formspree delivers by email.
const EMAIL = "vikdopke@gmail.com";
const FORMSPREE_FORM_ID = "xdekrjdq";
const MESSAGE_MAX = 1000;

const dialog = document.querySelector<HTMLDialogElement>("#contact")!;
const form = dialog.querySelector<HTMLFormElement>("form")!;
const sent = dialog.querySelector<HTMLElement>(".contact__sent")!;
const message = form.querySelector<HTMLTextAreaElement>("[name=message]")!;
const replyTo = form.querySelector<HTMLInputElement>("[name=email]")!;
const honeypot = form.querySelector<HTMLInputElement>("[name=_gotcha]")!;
const counter = form.querySelector<HTMLElement>(".contact__count")!;
const errorLine = form.querySelector<HTMLElement>(".contact__error")!;
const submit = form.querySelector<HTMLButtonElement>("[type=submit]")!;
const copy = dialog.querySelector<HTMLButtonElement>(".contact__copy")!;

function refresh() {
  counter.textContent = `${message.value.length}/${MESSAGE_MAX}`;
  submit.disabled = !message.value.trim();
}

function showSent(isSent: boolean) {
  form.hidden = isSent;
  sent.hidden = !isSent;
}

document.addEventListener("click", (e) => {
  if ((e.target as HTMLElement).closest("[data-contact]")) dialog.showModal();
});

// A click on the dimmed page lands on the dialog itself
dialog.addEventListener("click", (e) => {
  if (e.target === dialog || (e.target as HTMLElement).closest(".contact__close")) dialog.close();
});

copy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    copy.textContent = "Copied";
    setTimeout(() => (copy.textContent = "Copy"), 1800);
  } catch {
    // Clipboard can be unavailable; the mailto link still works
  }
});

message.addEventListener("input", () => {
  errorLine.hidden = true;
  refresh();
});

dialog.querySelector(".contact__again")!.addEventListener("click", () => showSent(false));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = message.value.trim();
  if (!text) return;

  // Bots fill hidden fields; quietly pretend it worked
  if (honeypot.value) {
    showSent(true);
    return;
  }

  submit.disabled = true;
  submit.textContent = "Sending…";
  errorLine.hidden = true;
  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        message: text,
        ...(replyTo.value ? { email: replyTo.value } : {}),
        page: location.pathname,
        _subject: "Hello from your portfolio",
      }),
    });
    if (res.ok) {
      form.reset();
      showSent(true);
    } else {
      // Formspree explains validation problems, e.g. an invalid email
      const data = await res.json().catch(() => null);
      const reason = data?.errors?.map((err: { message: string }) => err.message).join(" ");
      errorLine.textContent = reason || "Couldn't send right now. Try again, or email me directly.";
      errorLine.hidden = false;
    }
  } catch {
    errorLine.textContent = "Couldn't send right now. Try again, or email me directly.";
    errorLine.hidden = false;
  }
  submit.textContent = "Send";
  refresh();
});

refresh();
