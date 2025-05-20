Процедура за инсталиране, компилиране и стартиране на приложението Adoptly
1. Структура на проекта (/src)
/src
 ┣ app         – Next.js страници и маршрутизация
 ┣ components  – Повторно използваеми UI компоненти
 ┣ lib         – Логика, Mongoose модели и действия
 ┣ types       – TypeScript интерфейси и типове
 ┣ public      – Статични ресурси (изображения, икони и др.)

2. Изисквания (Prerequisites)
   
Уверете се, че имате инсталирани:
Инструмент	Препоръчителна версия
Node.js   	v18.x LTS или по-нова
npm / yarn	Съвместим с избрания Node.js
MongoDB	    Локално или чрез MongoDB Atlas
Git	        За клониране на проекта

3.Клониране на проекта
Изпълнете следните команди в терминал:
git clone https://github.com/Katerina1203/Adoptly.git

cd Adoptly

4. Инсталиране на зависимостите
С npm:
npm install

Или с yarn:
yarn install


5. Конфигуриране на средата (.env файл)
Създайте файл .env в root директорията със следното съдържание:

MONGODB_URI=mongodb+srv://<your_user>:<your_pass>@<your_cluster>/<db_name>
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

6. Стартиране на приложението в режим за разработка
7. 
С npm:
npm run dev

Или с yarn:
yarn dev

След стартиране, приложението ще бъде достъпно на:
 http://localhost:3000
 
7. Допълнителни команди
Команда	Описание
npm run build  	Генерира production билд
npm start     	Стартира вече компилираната production версия
npm run lint	  Извършва проверка за синтактични/логически грешки

