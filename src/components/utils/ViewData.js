export function getTweetData(tweet, response) {
  const authorId = tweet.author_id;
  var data = {...tweet};
  const userData = response.data.includes.users;
  userData.forEach(user => {
    if (user.id === authorId) {
      data = {...data, user};
      return;
    }
  });
  return data;
}
