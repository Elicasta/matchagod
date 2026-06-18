export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'Emma Cast Creative <onboarding@resend.dev>';
  const toEmail = process.env.ONBOARDING_TO || 'hello@eccreativestudios.com';

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY environment variable.' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  // Honeypot. Real users never see this field.
  if (body.companyWebsite) {
    return res.status(200).json({ ok: true });
  }

  const clean = (value) => String(value || '').trim().slice(0, 3000);

  const answers = {
    popupDates: clean(body.popupDates),
    weekdayAvailability: clean(body.weekdayAvailability),
    kitchenVibe: clean(body.kitchenVibe),
    priorityDetails: clean(body.priorityDetails),
    mustHaveShots: clean(body.mustHaveShots)
  };

  const hasAnswer = Object.values(answers).some(Boolean);
  if (!hasAnswer) {
    return res.status(400).json({ error: 'At least one answer is required.' });
  }

  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const subject = 'Matcha God Onboarding Answers';

  const text = `Matcha God Onboarding Answers\n\nSubmitted: ${submittedAt} ET\nSource: ${clean(body.source) || 'Invoice page'}\n\n1. Next pop-up dates:\n${answers.popupDates || 'Not answered'}\n\n2. Weekday availability for studio content session:\n${answers.weekdayAvailability || 'Not answered'}\n\n3. Kitchen setup vibe:\n${answers.kitchenVibe || 'Not answered'}\n\n4. Priority drinks, products, ingredients, or details:\n${answers.priorityDetails || 'Not answered'}\n\n5. Must-have shots, reel ideas, or brand details:\n${answers.mustHaveShots || 'Not answered'}\n`;

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; color: #1E2018; line-height: 1.6; max-width: 680px;">
      <h1 style="font-family: Georgia, serif; color: #1E3A20; font-weight: 400;">Matcha God Onboarding Answers</h1>
      <p><strong>Submitted:</strong> ${submittedAt} ET</p>
      <p><strong>Source:</strong> ${escapeHtml(clean(body.source) || 'Invoice page')}</p>
      ${answerBlock('1. Next pop-up dates', answers.popupDates)}
      ${answerBlock('2. Weekday availability for studio content session', answers.weekdayAvailability)}
      ${answerBlock('3. Kitchen setup vibe', answers.kitchenVibe)}
      ${answerBlock('4. Priority drinks, products, ingredients, or details', answers.priorityDetails)}
      ${answerBlock('5. Must-have shots, reel ideas, or brand details', answers.mustHaveShots)}
    </div>
  `;

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject,
      text,
      html,
      reply_to: toEmail
    })
  });

  const result = await resendResponse.json().catch(() => ({}));

  if (!resendResponse.ok) {
    return res.status(resendResponse.status).json({ error: result.message || 'Resend failed to send the email.' });
  }

  return res.status(200).json({ ok: true, id: result.id });
}

function answerBlock(label, value) {
  return `
    <div style="border-top: 1px solid #DDD5C0; padding-top: 16px; margin-top: 16px;">
      <p style="margin: 0 0 6px; letter-spacing: .08em; text-transform: uppercase; font-size: 12px; color: #6B7C47;"><strong>${escapeHtml(label)}</strong></p>
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(value || 'Not answered')}</p>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
