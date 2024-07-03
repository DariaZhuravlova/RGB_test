document.addEventListener('DOMContentLoaded', function () {

    const phoneInputField = document.querySelector("#phone");
    const phoneInput = window.intlTelInput(phoneInputField, {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
        initialCountry: "ua"
    });

    document.getElementById('form').addEventListener('submit', function (event) {
        event.preventDefault();

        const form = event.target;
        const name = form.name.value.trim();
        const tel = phoneInput.getNumber();
        const countryData = phoneInput.getSelectedCountryData();
        const country = countryData.name;
        const email = form.email.value.trim();
        const nameErrorMessages = document.getElementById('nameErrorMessages');
        const phoneErrorMessages = document.getElementById('phoneErrorMessages');
        const emailErrorMessages = document.getElementById('emailErrorMessages');
        const loader = document.getElementById('loader');

        nameErrorMessages.innerHTML = '';
        phoneErrorMessages.innerHTML = '';
        emailErrorMessages.innerHTML = '';

        let hasError = false;

        const showError = (message, errorContainer) => {
            hasError = true;
            errorContainer.innerHTML = `<p>${message}</p>`;
            console.error("Ошибка:", message);
        };

        if (!name) {
            showError('Введите ваше имя и фамилию.', nameErrorMessages);
        }

        if (!tel || !phoneInput.isValidNumber()) {
            showError('Введите корректный номер телефона.', phoneErrorMessages);
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            showError('Введите корректный email.', emailErrorMessages);
        }

        if (hasError) {
            return;
        }

        const formData = {
            country: country,
            name: name,
            tel: tel,
            email: email
        };

        loader.style.display = 'block';
        sendEmail(formData);

        form.reset();
        phoneInputField.value = '';
    });

    function sendEmail({ country, name, email, tel }) {
        const loader = document.getElementById('loader');

        emailjs.init('3ZMl780qXgUj-xkcY');

        const templateParams = {
            from_country: country,
            from_name: name,
            from_email: email,
            from_tel: tel
        };

        console.log("Параметры шаблона для отправки:", templateParams);

        emailjs.send('service_au6eag6', 'template_n4z15yj', templateParams)
            .then(function (response) {
                alert(`Ваши данные успешно отправлены!\n\nИмя и Фамилия: ${name}\nСтрана: ${country}\nТелефон: ${tel}\nEmail: ${email}`);
                loader.style.display = 'none';
            })
            .catch(function (error) {
                alert('Ошибка! Данные не отправлены!');
                loader.style.display = 'none';
            });
    }
});
