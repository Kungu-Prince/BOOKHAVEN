
export function formatFirebaseTimestamp(timestamp) {
  const now = new Date();
  const timestampDate = timestamp.toDate();

  // Calculate the time difference in milliseconds
  const timeDifference = now - timestampDate;

  // Define the time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;

  if (timeDifference < minute) {
    return 'Just now';
  } else if (timeDifference < hour) {
    const minutesAgo = Math.floor(timeDifference / minute);
    return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  } else if (now.toDateString() === timestampDate.toDateString()) {
    const hours = timestampDate.getHours();
    const minutes = timestampDate.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `Today, ${formattedHours}:${formattedMinutes} ${amOrPm}`;
  } else {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${timestampDate.getDate()} ${months[timestampDate.getMonth()]} ${timestampDate.getFullYear()}`;
    return formattedDate;
  }
}

export function averageRating(ratingsMap) {
  let weightedTotal = 0;
  let totalVotes = 0;

  for (const rating in ratingsMap) {
    if (ratingsMap.hasOwnProperty(rating)) {
      const votes = ratingsMap[rating];
      weightedTotal += rating * votes;
      totalVotes += votes;
    }
  }

  if (totalVotes === 0) {
    return 0; // Handle the case when there are no votes
  }

  const weightedAverage = weightedTotal / totalVotes;

  return weightedAverage.toFixed(2);
}