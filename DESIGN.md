# FlowDesk design system

## Product character

FlowDesk is an enterprise action workspace. The interface should feel precise, accountable, and easy to audit. It shows the product working before it describes the product: conversation and request context become a reviewable action draft, while rules and human confirmation remain visibly separate.

## Visual system

- Use an ice-white and blue-grey working surface with deep navy text and one cobalt action color.
- On the landing hero, build depth with a diffuse blue glow, a trace of pale violet, and a faint process grid that fades around the product window. These layers stay below 12% opacity and never compete with content.
- Reserve dark navy for workflow sections that explain ordered movement through the product.
- Use 10–16px radii for controls, product windows, and workspace cards. Data rows and process lanes use rules instead of nested cards.
- Headings are compact, sentence case, and moderately weighted. Chinese UI uses the platform Chinese sans stack; body copy stays at 16px or above where it carries meaning.
- Primary actions are cobalt filled buttons. Secondary actions are white with a visible border. Do not add a third button treatment.
- Use Lucide line icons consistently. Icons explain state or function; they do not decorate headings.

## Composition

- The landing first viewport is a split: product promise on the left, a real FlowDesk input-to-draft interface on the right.
- Give every landing section one job and generous vertical separation. Alternate composition instead of repeating equal icon cards.
- Operate pages prioritize the current task, review state, source evidence, and next action. Forms use visible labels and 46px minimum controls.
- Workspace headings stay compact. Review uses a source-and-draft split so a field selection reveals its sentence without leaving the current draft.
- On mobile, content becomes a single reading column, actions become full-width, and process diagrams stack without horizontal scrolling.

## Interaction and accessibility

- Keep one quiet motion signature: the landing promise, actions, and product window enter once in sequence. Do not use perpetual floating or pulsing motion.
- Every interactive element has visible hover and keyboard focus states.
- Body and secondary text must meet WCAG AA contrast. Warnings use a full amber border and explanatory text, never color alone.
- Respect `prefers-reduced-motion`; do not hide content behind entrance animation.

## Content rules

- Use “事项” / “action” consistently.
- Do not invent customer logos, performance figures, or proof.
- AI values, rule-calculated values, missing fields, and human confirmation must remain visually distinct.
- Keep owner, contact, and participant as separate roles. A mentioned contact or participant never becomes the owner without explicit source evidence or user confirmation.
