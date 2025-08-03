module.exports.randomGenerate  = (length) => {
  const characters = "0123456789"
  let randomNumber = ""
  for(let i = 1; i<= length; i++) {
    randomNumber+= characters.charAt(Math.floor(Math.random()*characters.length))
  }
  return randomNumber
}