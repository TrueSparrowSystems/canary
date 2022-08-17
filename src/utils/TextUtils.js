export function getFormattedStat(count) {
  if (count < Math.pow(10, 3)) {
    return `${count}`;
  }
  if (count < Math.pow(10, 6)) {
    var newValue = Math.round(count / 100) / 10;
    return `${newValue}k`;
  }
  if (count < Math.pow(10, 9)) {
    var newValue = Math.round(count / Math.pow(10, 5)) / 10;
    return `${newValue}m`;
  }
  var newValue = Math.round(count / Math.pow(10, 8)) / 10;
  return `${newValue}b`;
}

export function getInitialsFromName(fullName) {
  let nameInitials = '';
  const nameArray = fullName.split(' ');
  nameArray.map(name => {
    const char = name.charAt(0);
    // Allow only alphanumeric values
    if (
      (char >= 'a' && char <= 'z') ||
      (char >= 'A' && char <= 'Z') ||
      (char >= '0' && char <= '9')
    ) {
      nameInitials = nameInitials + char;
    }
  });
  return nameInitials;
}
