function fetchUser() {
  document.getElementById("loginuser").innerHTML = `Authenticating...`;
  return new Promise((resolve, reject) => {
    fetch("./gabek964_Activity12login.json")
    .then(()=>{return response.json})
    .then(()=>{resolve(data)})
    .catch((error)=>{console.log(error)})
  });
}
function login(users, userInput, passwordInput) {
if(users === userInput && users.password === passwordInput){
        document.getElementById("loginuser").innerHTML = " user and password are correct";
}else{
    document.getElementById("loginuser").innerHTML = " user and password are correct";

}
}
async function useAdmin(userInput, passwordInput) {
    let users = await fetchUser();
    login(users,userInput,passwordInput);
}
document.getElementById("loginButton").addEventListener("click", (event) => {
  event.preventDefault();
  const userInput = document.getElementById("userInput").value;
  const passwordInput = document.getElementById("passwordInput").value;
  useAdmin(userInput,passwordInput);
});
