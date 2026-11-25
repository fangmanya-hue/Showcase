# FlowDesk workspace review iteration

Date: 2026-11-25

## User problems addressed

- Workspace headings and demo notes occupied too much of the task area.
- Intake required users to prepare context and separate actions before pasting chat.
- The first demo incorrectly treated “义总秘书” as the action owner.
- Review required repeated scrolling between extracted fields and source evidence.
- Detail status did not distinguish rule-calculated state from a user-confirmed closure.

## Product decisions

- The default intake goal is now “extract follow-up actions from conversation.” Only the raw chat is required. Special instructions, business line, and message date are secondary settings.
- Raw input is split by blank paragraphs, numbered entries, or message lines. Unsupported or ambiguous values remain pending instead of being inferred.
- Mention roles are separate: owner drives completion, contact is the person to reach, and participant joins the work. “义总秘书” is the contact, “计算义总” is the participant, and the owner requires confirmation.
- Review uses a two-column source-and-draft layout. Selecting a field highlights its linked sentence while preserving the full original message.
- Closed status is displayed as a user-confirmed operation. Date normalization and overdue state remain rule-calculated. History entries carry their operation source.

## Verification

- FlowDesk rule and locale checks passed for all 43 Chinese/English resource pairs.
- TypeScript and the Next.js production build passed.
- Browser flow passed from intake through review, list, detail, confirmed closure, and undo-capable history.
- Desktop and 375px mobile review layouts were visually checked; no horizontal overflow was found.
