require('../src/db/mongoose.js');
const User = require('../src/models/user');

User.findByIdAndUpdate('682c5832460086fe0b952272', { age: 30 })
  .then((user) => {
    console.log(user);
    return User.countDocuments({ age: 30 });
  })
  .then((count) => {
    console.log(count);
  }).catch((error) => {
    console.error('Error:', error);
  })
  .finally(() => {
    console.log('Operation completed');
  });


  const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return { user, count };
  };

updateAgeAndCount('682c5832460086fe0b952272', 30).then(({ user, count }) => {
  console.log(user);
  console.log(count);
}).catch((error) => {
  console.error('Error:', error);
}).finally(() => {
  console.log('Operation completed');
}); 
    