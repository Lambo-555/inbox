//______________ PROTECTION ___________________
// replace dangerous chars in message strings
export default function stringProtection(string) {
  // add auto emoji secret
  string = string.replace(/:\)/gm, '😀');
  string = string.replace(/:\(/gm, '😥');
  return string.replace(/[&<>"']/gm, '');
}