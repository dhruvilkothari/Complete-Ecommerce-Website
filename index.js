const likes = [{ user: 123 }, { user: 124 }, { user: 125 }];

const index = likes.findIndex((item) => {
  return item.user === 1255;
});

console.log(index);
