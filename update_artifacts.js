const fs = require('fs');

const taskPath = '/home/kirek/.gemini/antigravity-ide/brain/7f83a466-eb67-4524-af94-b8f30675866a/task.md';
let taskContent = fs.readFileSync(taskPath, 'utf8');
taskContent = taskContent.replace(
  /-\s*\[\/\]\s*Review other hardcoded texts in the application \(e\.g\., Navbar\) that might be missed./,
  '- [x] Review other hardcoded texts in the application (e.g., Navbar) that might be missed.'
);
fs.writeFileSync(taskPath, taskContent, 'utf8');

const walkthroughPath = '/home/kirek/.gemini/antigravity-ide/brain/7f83a466-eb67-4524-af94-b8f30675866a/walkthrough.md';
let walkthroughContent = fs.readFileSync(walkthroughPath, 'utf8');
walkthroughContent += `
## Comprehensive i18n Rollout
- Fully translated the \`WalletPage\`, \`CheckoutPage\`, \`SavedAddresses\`, and \`OrderSummary\` components by extracting hardcoded text to \`en.json\` and \`id.json\` and replacing them with \`t()\` using the \`useTranslation\` hook.
- Investigated and translated all strings in the \`NavbarClient\` component to address the issue of lingering hardcoded strings in dropdowns, the search bar, category navigation, and the mobile sidebar menu.
- Verified that translations correctly fall back to default languages and dynamically switch when the user selects English or Indonesian from the top bar.
- Tested address submission from the checkout modal; verified payload correctness and error handling flow.
`;
fs.writeFileSync(walkthroughPath, walkthroughContent, 'utf8');
