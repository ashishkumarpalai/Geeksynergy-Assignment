document.addEventListener("DOMContentLoaded", function () {
    const loginToggle = document.getElementById("signup-toggle");
    const signupToggle = document.getElementById("login-toggle");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    signupToggle.style.backgroundColor = "#0056b3";
    signupToggle.style.color = "white";
    signupToggle.style.borderRadius="5px";
    loginToggle.style.borderRadius="5px";
    loginToggle.style.backgroundColor = "transparent";
    loginToggle.addEventListener("click", function () {
        loginForm.style.display = "block";
        signupForm.style.display = "none";
        loginToggle.style.backgroundColor = "#0056b3";
        loginToggle.style.color = "white";
        signupToggle.style.color = "black";
        signupToggle.style.backgroundColor = "transparent";
    });

    signupToggle.addEventListener("click", function () {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        signupToggle.style.backgroundColor = "#0056b3";
        signupToggle.style.color = "white";
        loginToggle.style.color = "black";
        loginToggle.style.backgroundColor = "transparent";
    });

    // Submit event listener for login form

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = loginForm.querySelector('#login-email').value;
        const password = loginForm.querySelector('#login-password').value;

        const loginData = {
            email: email,
            password: password
        };

        fetch("https://geeksynergy-wmak.onrender.com/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.msg === "Sucessfully Login") {
                    // Optional: You might only want to store the token or minimal data in localStorage
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user)); // Assuming data.user is an object
                    localStorage.setItem("name", data.name); // Assuming data.name is a string
                    console.log("Login successful:", data);

                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'You have successfully logged in.',
                    });

                    // Redirect to another page after a delay
                    setTimeout(function () {
                        window.location.href = "../page/content.html";
                    }, 2000); // 2000 milliseconds (2 seconds) delay
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Invalid credentials. Please try again.',
                    });

                    // Optionally, you might not need to redirect on failed login
                    setTimeout(function () {
                        // Redirect only if needed
                        window.location.href = "../index.html";
                    }, 2000); // 2000 milliseconds (2 seconds) delay
                }

                console.log("Login API Response:", data);
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while processing your request. Please try again later.',
                });
            });
    });



    // Submit event listener for signup form
    
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = signupForm.querySelector('#signup-name').value;
        const email = signupForm.querySelector('#signup-email').value;
        const password = signupForm.querySelector('#signup-password').value;
        const phone = signupForm.querySelector('#signup-phone').value;
        const profession = signupForm.querySelector('#signup-profession').value;

        const signupData = {
            name: fullName,
            email: email,
            password: password,
            phone: phone,
            profession: profession
        };

        fetch("https://geeksynergy-wmak.onrender.com/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signupData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Signup API Response:", data);

                if (data.msg === "new User has been register") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful',
                        text: 'You have successfully registered.',
                    });
                    setTimeout(function () {
                        window.location.href = "../index.html";
                    }, 2000);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Registration Failed',
                        text: 'You are already registered.',
                    });
                    setTimeout(function () {
                        window.location.href = "../index.html";
                    }, 2000);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while processing your request. Please try again later.',
                });
                setTimeout(function () {
                    window.location.href = "../index.html";
                }, 2000);
            });
    });


});
