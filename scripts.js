document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM полностью загружен и разобран");

    const phoneInputField = document.querySelector("#phone");
    const phoneInput = window.intlTelInput(phoneInputField, {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
        initialCountry: "ua"
    });
    console.log("IntlTelInput инициализирован");

    document.getElementById('form').addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("Форма отправлена");

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

        console.log("Данные формы:", { name, tel, country, email });

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
            console.log("Есть ошибки в форме, отправка прервана");
            return;
        }

        const formData = {
            country: country,
            name: name,
            tel: tel,
            email: email
        };

        console.log("Форма данных для отправки:", formData);

        loader.style.display = 'block';
        // sendEmailToTelegram(formData);
        sendEmailToEmailJS(formData);

        form.reset();
        phoneInputField.value = '';
        console.log("Форма сброшена");
    });

    // function sendEmailToTelegram({ country, name, email, tel }) {
    //     const url = 'https://api.telegram.org/bot7301777221:AAHN2KyML82ReOlE2BHpQhqU6TqyEW2L7m0/sendMessage';
    
    //     const message = `
    //         Сообщение с формы:
    //         Страна: ${country}
    //         Имя: ${name}
    //         Email: ${email}
    //         Телефон: ${tel.replace(/\s/g, '%20')}
    //     `;
    
    //     const params = new URLSearchParams({
    //         chat_id: '@dariazhuravleva',
    //         text: message,
    //     });
    
    //     // Отправляем запрос
    //     fetch(`${url}?${params}`, { method: 'GET' })
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Ошибка HTTP: ' + response.status);
    //             }
    //             console.log("Данные успешно отправлены на Telegram");
    //         })
    //         .catch(error => {
    //             console.error("Ошибка при отправке данных на Telegram:", error);
    //         });
    // }
    

    function sendEmailToEmailJS({ country, name, email, tel }) {
        const loader = document.getElementById('loader');

        emailjs.init('3ZMl780qXgUj-xkcY');

        const templateParams = {
            from_country: country,
            from_name: name,
            from_email: email,
            from_tel: tel
        };

        console.log("Параметры шаблона для отправки в EmailJS:", templateParams);

        emailjs.send('service_au6eag6', 'template_ywg1g9x', templateParams)
            .then(function (response) {
                console.log("Email успешно отправлен через EmailJS", response.status, response.text);
                alert('Ваши данные успешно отправлены!');
                loader.style.display = 'none';
            })
            .catch(function (error) {
                console.error("Ошибка при отправке email через EmailJS:", error);
                alert('Ошибка! Данные не отправлены!');
                loader.style.display = 'none';
            });
    }
});
