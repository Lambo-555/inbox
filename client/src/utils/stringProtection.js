//______________ PROTECTION ___________________
// replace dangerous chars in message strings
export default function stringProtection(string) {
  return string.replace(/[&<>"']/gm, '');
}