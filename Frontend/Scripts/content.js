
async function fetchUsers() {
    const response = await fetch('https://geeksynergy-wmak.onrender.com/user');
    const users = await response.json();

    const tableBody = document.getElementById('userTableBody');
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>${user.profession}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editUser('${user._id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
    });
}
async function deleteUser(userId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Processing...',
                text: 'Please wait a moment',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            setTimeout(async () => {
                try {
                    const response = await fetch(`https://geeksynergy-wmak.onrender.com/user/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: localStorage.getItem("token")
                        }
                    });

                    const result = await response.json();
                    console.log(response);
                    if (response.ok) {
                        Swal.fire('Deleted!', result.msg, 'success');
                        // Optionally, refresh the user list or remove the user from the DOM
                        location.reload();
                    } else {
                        Swal.fire('Error', result.msg, 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Something went wrong', 'error');
                }
            }, 2000); // Wait for 2 seconds before deleting
        }
    });
}



async function editUser(userId) {
    try {
        // Fetch existing user data to prefill the form
        const response = await fetch(`https://geeksynergy-wmak.onrender.com/user/?id=${userId}`);
        const user = await response.json();
        console.log(user)
        if (response.ok) {
            // Display a form in SweetAlert with prefilled data and required fields
            const { value: formValues } = await Swal.fire({
                title: 'Update User Information',
                html: `
                    <input id="swal-input1" class="swal2-input" placeholder="Name" value="${user[0].name}" required>
                    <input id="swal-input2" class="swal2-input" placeholder="Email" value="${user[0].email}" required>
                    <input id="swal-input3" class="swal2-input" placeholder="Phone" value="${user[0].phone}" required>
                    <input id="swal-input4" class="swal2-input" placeholder="Profession" value="${user[0].profession}" required>
                `,
                focusConfirm: false,
                preConfirm: () => {
                    // Ensure all fields are filled
                    const name = document.getElementById('swal-input1').value.trim();
                    const email = document.getElementById('swal-input2').value.trim();
                    const phone = document.getElementById('swal-input3').value.trim();
                    const profession = document.getElementById('swal-input4').value.trim();

                    if (!name || !email || !phone || !profession) {
                        Swal.showValidationMessage('All fields are required');
                        return null;
                    }

                    return [name, email, phone, profession];
                }
            });

            if (formValues) {
                // Show a confirmation popup before processing the update
                Swal.fire({
                    title: 'Are you sure?',
                    text: "Do you want to save these changes?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, save it!'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: 'Processing...',
                            text: 'Please wait a moment',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        setTimeout(async () => {
                            try {
                                const response = await fetch(`https://geeksynergy-wmak.onrender.com/user/${userId}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: localStorage.getItem("token")
                                    },
                                    body: JSON.stringify({
                                        name: formValues[0],
                                        email: formValues[1],
                                        phone: formValues[2],
                                        profession: formValues[3]
                                    })
                                });

                                const result = await response.json();

                                if (response.ok) {
                                    Swal.fire('Updated!', result.msg, 'success');
                                    location.reload(); // Optionally refresh the page
                                } else {
                                    Swal.fire('Error', result.msg, 'error');
                                }
                            } catch (error) {
                                Swal.fire('Error', 'Something went wrong', 'error');
                            }
                        }, 2000); // Wait for 2 seconds before updating
                    }
                });
            }
        } else {
            Swal.fire('Error', 'User data could not be retrieved', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Something went wrong while fetching user data', 'error');
    }
}

fetchUsers();

