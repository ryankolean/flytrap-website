// intentCaptureSubmission.ts
// Email capture for "Coming Soon" Toast online-ordering notification signup
// from docs/01-design-document-v1.7.md §9 Section 3.5 (Order Online Coming Soon stub, intent-capture form)

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'intentCaptureSubmission',
  title: 'Intent Capture Submission',
  type: 'document',
  description: 'An email address submitted via the "Get notified when online ordering goes live" form. Staff can export as a batch after launch.',
  fields: [
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) =>
        Rule.required().email(),
      description: 'Subscriber email. from docs/01-design-document-v1.7.md §9 Section 3.5.',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      description: 'Timestamp when the form was submitted. Auto-populated on creation.',
    }),
    defineField({
      name: 'notified',
      title: 'Notified',
      type: 'boolean',
      description: 'Set true after the subscriber has been notified that online ordering is live. Used to track which emails to include in the launch email.',
    }),
  ],
  preview: {
    select: {
      email: 'email',
      date: 'submittedAt',
      notified: 'notified',
    },
    prepare({ email, date, notified }) {
      return {
        title: email,
        subtitle: `Submitted: ${date}${notified ? ' [NOTIFIED]' : ''}`,
      };
    },
  },
});
