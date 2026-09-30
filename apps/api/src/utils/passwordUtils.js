import bcrypt from 'bcryptjs';

// Generates a hash using a salt
async function genPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const genHash = await bcrypt.hash(password, salt);
  console.log("Showing gen hash");
  console.log(genHash);
  return {
    hash: genHash
  }
}

// Checks if inputted password when logging in is the same as in the stored hash
// bcrypt's compare function doesn't need to re-salt the plain-text password to compare
async function validatePassword(password, hash) {
  return await bcrypt.compare(password, hash);
};

export { genPassword, validatePassword }
