const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const { transformUser } = require('./utils')

module.exports = {
  /*
    mutation {
      createUser(userInput: {email: "karthick@kk.com", password: "testing" }) {
        _id
        email
        password
      }
    }
  */
  createUser: async args => {
    const previousUser = await User.findOne({ email: args.userInput.email })
    if (previousUser) {
      // dont allow users with same user id
      throw new Error('User Exists Alredy')
    } else {
      try {
        // 12 is a safe salt value
        const hash = await bcrypt.hash(args.userInput.password, 12)
        const user = new User({
          email: args.userInput.email,
          // always store only the hash of the password not the plain text of the password
          // in this way even if db is ahcked one cant get the password of the user
          password: hash
        })
        const savedUser = await user.save()
        return transformUser(savedUser)
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  },
  /*
  {
    "query": "query { login(email: \"karthick@kk.com\", password: \"testing\") { token }}"
  }
  */
  login: async ({email, password }) => {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error('User does not exist!')
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      throw new Error('Password is incorrect!')
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, 'some-super-secret-key', {
      expiresIn: '1h'
    })
    return { userId: user.id, token, tokenExpiration: 1 }
  },
}